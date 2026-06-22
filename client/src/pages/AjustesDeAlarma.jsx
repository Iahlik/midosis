import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { LocalNotifications } from '@capacitor/local-notifications';
import { useAuth } from '../context/AuthProvider';
import 'animate.css';

// Genera IDs únicos por medicamento (Capacitor requiere enteros de 32 bits)
function notifId(dosisId, doseIndex) {
  return dosisId * 100 + doseIndex;
}

function calcularHorasDosis(horaInicio, intervaloHoras) {
  const horas = [];
  const [h, m] = horaInicio.split(':').map(Number);
  let acum = h * 60 + m;
  while (acum < 24 * 60) {
    horas.push(acum);
    acum += intervaloHoras * 60;
  }
  return horas;
}

function AjustesDeAlarma() {
  const { user, token, fetchMedicamentos } = useAuth();
  const [medicamentos, setMedicamentos] = useState([]);
  const [horaInicio, setHoraInicio] = useState({});
  const [activos, setActivos] = useState({});
  const [permiso, setPermiso] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (!user?.id) return;

      try {
        const data = await fetchMedicamentos(user.id, token);
        setMedicamentos(data);

        const horasGuardadas = JSON.parse(localStorage.getItem('horaInicio') || '{}');
        const activosGuardados = JSON.parse(localStorage.getItem('notifActivos') || '{}');
        setHoraInicio(horasGuardadas);
        setActivos(activosGuardados);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [user, token, fetchMedicamentos]);

  const solicitarPermiso = async () => {
    const result = await LocalNotifications.requestPermissions();
    setPermiso(result.display);
    return result.display === 'granted';
  };

  const programarRecordatorios = async (medicamento) => {
    const tienePermiso = await solicitarPermiso();
    if (!tienePermiso) {
      setMensaje({ tipo: 'danger', texto: 'Debes permitir las notificaciones para activar los recordatorios.' });
      return;
    }

    const hora = horaInicio[medicamento.dosis_id] || '08:00';
    const minutos = calcularHorasDosis(hora, medicamento.intervalo_horas);

    // Cancela notificaciones anteriores de este medicamento
    const idsAnteriores = Array.from({ length: 24 }, (_, i) => ({ id: notifId(medicamento.dosis_id, i) }));
    await LocalNotifications.cancel({ notifications: idsAnteriores }).catch(() => {});

    const notificaciones = minutos.map((minutosDia, index) => {
      const horas = Math.floor(minutosDia / 60);
      const mins = minutosDia % 60;
      const ahora = new Date();
      const fecha = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), horas, mins, 0);
      if (fecha <= ahora) fecha.setDate(fecha.getDate() + 1);

      return {
        id: notifId(medicamento.dosis_id, index),
        title: '💊 Hora de tu medicamento',
        body: `Toma ${medicamento.nombre_medicamento} — ${medicamento.cantidad_mg} mg`,
        schedule: { at: fecha, repeats: true, every: 'day' },
        sound: null,
        attachments: null,
        actionTypeId: '',
        extra: { dosisId: medicamento.dosis_id },
      };
    });

    await LocalNotifications.schedule({ notifications: notificaciones });

    const nuevosActivos = { ...activos, [medicamento.dosis_id]: true };
    const nuevasHoras = { ...horaInicio, [medicamento.dosis_id]: hora };
    setActivos(nuevosActivos);
    setHoraInicio(nuevasHoras);
    localStorage.setItem('notifActivos', JSON.stringify(nuevosActivos));
    localStorage.setItem('horaInicio', JSON.stringify(nuevasHoras));

    setMensaje({
      tipo: 'success',
      texto: `Recordatorios programados para ${medicamento.nombre_medicamento} cada ${medicamento.intervalo_horas}h desde las ${hora}.`,
    });
  };

  const cancelarRecordatorios = async (medicamento) => {
    const ids = Array.from({ length: 24 }, (_, i) => ({ id: notifId(medicamento.dosis_id, i) }));
    await LocalNotifications.cancel({ notifications: ids }).catch(() => {});

    const nuevosActivos = { ...activos, [medicamento.dosis_id]: false };
    setActivos(nuevosActivos);
    localStorage.setItem('notifActivos', JSON.stringify(nuevosActivos));

    setMensaje({ tipo: 'warning', texto: `Recordatorios de ${medicamento.nombre_medicamento} cancelados.` });
  };

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;

  return (
    <Container className="animate__animated animate__fadeIn mt-4 mb-5">
      <h1>Ajustes de Alarma</h1>
      <p className="text-muted">
        Programa recordatorios diarios para cada medicamento. La notificación se repetirá automáticamente
        según el intervalo de horas indicado.
      </p>

      {mensaje && (
        <Alert variant={mensaje.tipo} dismissible onClose={() => setMensaje(null)}>
          {mensaje.texto}
        </Alert>
      )}

      {medicamentos.length === 0 && (
        <Alert variant="info">No tienes medicamentos registrados. Agrégalos primero desde tu perfil.</Alert>
      )}

      {medicamentos.map((med) => (
        <Card key={med.dosis_id} className="mb-3">
          <Card.Body>
            <Card.Title>{med.nombre_medicamento}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              {med.cantidad_mg} mg · cada {med.intervalo_horas} horas
            </Card.Subtitle>

            <Form.Group className="mb-3">
              <Form.Label>Hora de la primera dosis del día</Form.Label>
              <Form.Control
                type="time"
                value={horaInicio[med.dosis_id] || '08:00'}
                onChange={(e) =>
                  setHoraInicio((prev) => ({ ...prev, [med.dosis_id]: e.target.value }))
                }
                style={{ maxWidth: '150px' }}
              />
              <Form.Text className="text-muted">
                Se programarán recordatorios a las:{' '}
                {calcularHorasDosis(horaInicio[med.dosis_id] || '08:00', med.intervalo_horas)
                  .map((min) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`)
                  .join(', ')}
              </Form.Text>
            </Form.Group>

            {activos[med.dosis_id] ? (
              <div className="d-flex gap-2">
                <Button variant="success" size="sm" onClick={() => programarRecordatorios(med)}>
                  Actualizar
                </Button>
                <Button variant="outline-danger" size="sm" onClick={() => cancelarRecordatorios(med)}>
                  Cancelar recordatorios
                </Button>
              </div>
            ) : (
              <Button variant="primary" size="sm" onClick={() => programarRecordatorios(med)}>
                Activar recordatorios
              </Button>
            )}

            {activos[med.dosis_id] && (
              <small className="d-block mt-2 text-success">✓ Recordatorios activos</small>
            )}
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
}

export default AjustesDeAlarma;
