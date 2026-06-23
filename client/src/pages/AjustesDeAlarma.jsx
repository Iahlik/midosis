import React, { useEffect, useState } from 'react';
import { Container, Button, Card, Alert, Spinner, Form, Badge } from 'react-bootstrap';
import { LocalNotifications } from '@capacitor/local-notifications';
import { useAuth } from '../context/AuthProvider';
import { calcularHorasDosis, labelFrecuencia } from '../utils/frecuencias';
import 'animate.css';

// ID único por dosis (Capacitor requiere enteros positivos de 32 bits)
function notifId(dosisId, index) {
  return (dosisId * 100 + index) & 0x7fffffff;
}

function AjustesDeAlarma() {
  const { user, token, fetchMedicamentos } = useAuth();
  const [medicamentos, setMedicamentos] = useState([]);
  const [horasLocales, setHorasLocales] = useState({});
  const [activos, setActivos] = useState({});
  const [mensaje, setMensaje] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (!user?.id) return;
      try {
        const data = await fetchMedicamentos(user.id, token);
        setMedicamentos(data);
        setActivos(JSON.parse(localStorage.getItem('notifActivos') || '{}'));
        setHorasLocales(JSON.parse(localStorage.getItem('horasLocales') || '{}'));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [user, token, fetchMedicamentos]);

  // Fuente de verdad: hora_inicio del medicamento, o la local si no tiene
  const getHora = (med) =>
    med.hora_inicio ? med.hora_inicio.slice(0, 5) : (horasLocales[med.dosis_id] || '');

  const setHoraLocal = (dosisId, valor) => {
    const nuevo = { ...horasLocales, [dosisId]: valor };
    setHorasLocales(nuevo);
    localStorage.setItem('horasLocales', JSON.stringify(nuevo));
  };

  const programar = async (med) => {
    const hora = getHora(med);
    if (!hora) {
      setMensaje({ tipo: 'warning', texto: 'Configura una hora de inicio para este medicamento.' });
      return;
    }

    const { display } = await LocalNotifications.requestPermissions();
    if (display !== 'granted') {
      setMensaje({ tipo: 'danger', texto: 'Debes permitir las notificaciones en los ajustes de tu teléfono.' });
      return;
    }

    // Cancela anteriores de este medicamento
    const anterior = Array.from({ length: 24 }, (_, i) => ({ id: notifId(med.dosis_id, i) }));
    await LocalNotifications.cancel({ notifications: anterior }).catch(() => {});

    const intervalo = med.intervalo_horas;

    if (intervalo > 24) {
      // Para medicamentos de más de un día: una sola notificación diaria con aviso condicional
      const [h, m] = hora.split(':').map(Number);
      const ahora = new Date();
      const fecha = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), h, m, 0);
      if (fecha <= ahora) fecha.setDate(fecha.getDate() + 1);

      await LocalNotifications.schedule({
        notifications: [{
          id: notifId(med.dosis_id, 0),
          title: 'Recordatorio de medicamento',
          body: `¿Corresponde hoy? ${med.nombre_medicamento} — ${med.cantidad_mg} mg`,
          schedule: { at: fecha, repeats: true, every: 'day' },
          actionTypeId: '',
          extra: { dosisId: med.dosis_id },
        }],
      });
    } else {
      // Para medicamentos diarios: una notificación por cada dosis del día
      const tiempos = calcularHorasDosis(hora, intervalo);
      const notificaciones = tiempos.map((horario, index) => {
        const [h, m] = horario.split(':').map(Number);
        const ahora = new Date();
        const fecha = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), h, m, 0);
        if (fecha <= ahora) fecha.setDate(fecha.getDate() + 1);
        return {
          id: notifId(med.dosis_id, index),
          title: 'Hora de tu medicamento',
          body: `${med.nombre_medicamento} — ${med.cantidad_mg} mg`,
          schedule: { at: fecha, repeats: true, every: 'day' },
          actionTypeId: '',
          extra: { dosisId: med.dosis_id },
        };
      });
      await LocalNotifications.schedule({ notifications: notificaciones });
    }

    const nuevosActivos = { ...activos, [med.dosis_id]: true };
    setActivos(nuevosActivos);
    localStorage.setItem('notifActivos', JSON.stringify(nuevosActivos));
    setMensaje({ tipo: 'success', texto: `Recordatorios activados para ${med.nombre_medicamento}.` });
  };

  const cancelar = async (med) => {
    const ids = Array.from({ length: 24 }, (_, i) => ({ id: notifId(med.dosis_id, i) }));
    await LocalNotifications.cancel({ notifications: ids }).catch(() => {});
    const nuevosActivos = { ...activos, [med.dosis_id]: false };
    setActivos(nuevosActivos);
    localStorage.setItem('notifActivos', JSON.stringify(nuevosActivos));
    setMensaje({ tipo: 'warning', texto: `Recordatorios de ${med.nombre_medicamento} desactivados.` });
  };

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;

  return (
    <Container className="animate__animated animate__fadeIn mt-4 mb-5">
      <h1>Alarmas</h1>
      <p className="text-muted mb-3">
        Activa los recordatorios para cada medicamento. Las horas se calculan a partir de tu configuración de perfil.
      </p>

      {mensaje && (
        <Alert variant={mensaje.tipo} dismissible onClose={() => setMensaje(null)}>
          {mensaje.texto}
        </Alert>
      )}

      {medicamentos.length === 0 && (
        <Alert variant="warning">
          No tienes medicamentos registrados. Agrégalos desde tu perfil.
        </Alert>
      )}

      {medicamentos.map((med) => {
        const hora = getHora(med);
        const tieneHora = !!hora;
        const esIntervaloLargo = med.intervalo_horas > 24;
        const tiempos = tieneHora && !esIntervaloLargo
          ? calcularHorasDosis(hora, med.intervalo_horas)
          : [];
        const activo = !!activos[med.dosis_id];

        return (
          <Card key={med.dosis_id} className={`mb-3 ${activo ? 'border-success' : ''}`}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <Card.Title className="mb-0">{med.nombre_medicamento}</Card.Title>
                  <div className="text-muted small">{med.cantidad_mg} mg · {labelFrecuencia(med.intervalo_horas)}</div>
                </div>
                {activo && <Badge bg="success">Activo</Badge>}
              </div>

              {/* Hora de inicio */}
              {med.hora_inicio ? (
                <div className="mb-2 small">
                  <span className="text-muted">Hora configurada: </span>
                  <strong>{med.hora_inicio.slice(0, 5)}</strong>
                  <span className="text-muted"> (edítala desde tu perfil)</span>
                </div>
              ) : (
                <Form.Group className="mb-2">
                  <Form.Label className="small fw-semibold">
                    Hora de inicio{' '}
                    <span className="text-warning fw-normal">(no configurada en perfil)</span>
                  </Form.Label>
                  <Form.Control
                    type="time"
                    style={{ maxWidth: '140px' }}
                    value={hora}
                    onChange={(e) => setHoraLocal(med.dosis_id, e.target.value)}
                  />
                </Form.Group>
              )}

              {/* Preview de horarios */}
              {tieneHora && (
                <div className="mb-3">
                  {esIntervaloLargo ? (
                    <div className="small text-muted">
                      Notificación diaria a las <strong>{hora}</strong> recordándote que tomes el medicamento si corresponde.
                    </div>
                  ) : (
                    <div className="d-flex flex-wrap align-items-center gap-1">
                      <span className="text-muted small">Notificaciones:</span>
                      {tiempos.map((t, i) => (
                        <Badge key={i} bg={activo ? 'success' : 'primary'} style={{ fontSize: '0.8rem' }}>
                          {t}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Acciones */}
              {activo ? (
                <div className="d-flex gap-2">
                  <Button variant="outline-success" size="sm" onClick={() => programar(med)}>
                    Actualizar
                  </Button>
                  <Button variant="outline-danger" size="sm" onClick={() => cancelar(med)}>
                    Desactivar
                  </Button>
                </div>
              ) : (
                <Button variant="primary" size="sm" onClick={() => programar(med)} disabled={!tieneHora}>
                  {tieneHora ? 'Activar recordatorios' : 'Configura una hora para activar'}
                </Button>
              )}
            </Card.Body>
          </Card>
        );
      })}
    </Container>
  );
}

export default AjustesDeAlarma;
