import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthProvider';
import DosePreview from '../components/DosePreview';
import { FRECUENCIAS, DURACIONES } from '../utils/frecuencias';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function FormularioDeMedicamento({ onSave }) {
  const { user, token } = useAuth();
  const [catalogo, setCatalogo] = useState([]);
  const [medicamentoId, setMedicamentoId] = useState('');
  const [modoManual, setModoManual] = useState(false);
  const [nombreManual, setNombreManual] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [frecuenciaKey, setFrecuenciaKey] = useState('24');
  const [intervaloPersonalizado, setIntervaloPersonalizado] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [duracionKey, setDuracionKey] = useState('indefinido');
  const [duracionPersonalizada, setDuracionPersonalizada] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingCatalogo, setLoadingCatalogo] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarCatalogo = async () => {
      try {
        const res = await fetch(`${API_URL}/catalogo-medicamentos`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setCatalogo(data);
      } catch {
        setError('No se pudo cargar el catálogo de medicamentos.');
      } finally {
        setLoadingCatalogo(false);
      }
    };
    cargarCatalogo();
  }, [token]);

  const intervaloHoras =
    frecuenciaKey === 'personalizado' ? parseInt(intervaloPersonalizado) || null : parseInt(frecuenciaKey);

  const cadaCuantoDias =
    duracionKey === 'indefinido' ? null
    : duracionKey === 'personalizado' ? (parseInt(duracionPersonalizada) || null)
    : parseInt(duracionKey);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (modoManual && !nombreManual.trim()) { setError('Ingresa el nombre del medicamento.'); return; }
    if (!modoManual && !medicamentoId) { setError('Selecciona un medicamento del catálogo.'); return; }
    if (!cantidad) { setError('Ingresa la cantidad en mg.'); return; }
    if (!intervaloHoras) { setError('Selecciona o ingresa el intervalo entre dosis.'); return; }

    setLoading(true);
    try {
      let medId = parseInt(medicamentoId);

      if (modoManual) {
        const catRes = await fetch(`${API_URL}/catalogo-medicamentos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ nombre: nombreManual.trim() }),
        });
        if (!catRes.ok) throw new Error();
        medId = (await catRes.json()).medicamento_id;
      }

      const res = await fetch(`${API_URL}/medicamentos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          usuario_id: user.id,
          medicamento_id: medId,
          cantidad_mg: parseFloat(cantidad),
          intervalo_horas: intervaloHoras,
          cada_cuanto_dias: cadaCuantoDias,
          hora_inicio: horaInicio || null,
        }),
      });
      if (!res.ok) throw new Error();

      const medsRes = await fetch(`${API_URL}/medicamentos/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const meds = await medsRes.json();
      onSave(meds[meds.length - 1]);

      setCantidad(''); setFrecuenciaKey('24'); setIntervaloPersonalizado('');
      setHoraInicio(''); setDuracionKey('indefinido'); setDuracionPersonalizada('');
      setMedicamentoId(''); setNombreManual('');
    } catch {
      setError('Error al guardar el medicamento. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingCatalogo) return <Spinner animation="border" size="sm" />;

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Medicamento */}
      <Form.Group className="mb-3">
        <Form.Label>Medicamento</Form.Label>
        {!modoManual ? (
          <>
            <Form.Select value={medicamentoId} onChange={(e) => setMedicamentoId(e.target.value)}>
              <option value="">Selecciona del catálogo...</option>
              {catalogo.map((m) => (
                <option key={m.medicamento_id} value={m.medicamento_id}>{m.nombre}</option>
              ))}
            </Form.Select>
            <Form.Text className="text-muted">
              ¿No está en la lista?{' '}
              <Button variant="link" size="sm" className="p-0 align-baseline"
                onClick={() => { setModoManual(true); setMedicamentoId(''); }}>
                Ingresar manualmente
              </Button>
            </Form.Text>
          </>
        ) : (
          <>
            <Form.Control type="text" placeholder="Nombre del medicamento"
              value={nombreManual} onChange={(e) => setNombreManual(e.target.value)} />
            <Form.Text className="text-muted">
              <Button variant="link" size="sm" className="p-0 align-baseline"
                onClick={() => { setModoManual(false); setNombreManual(''); }}>
                Seleccionar del catálogo
              </Button>
            </Form.Text>
          </>
        )}
      </Form.Group>

      {/* Cantidad */}
      <Form.Group className="mb-3">
        <Form.Label>Cantidad (mg)</Form.Label>
        <Form.Control type="number" min="0.1" step="0.1" placeholder="Ej: 500"
          value={cantidad} onChange={(e) => setCantidad(e.target.value)} required />
      </Form.Group>

      {/* Frecuencia */}
      <Form.Group className="mb-3">
        <Form.Label>Frecuencia</Form.Label>
        <Form.Select value={frecuenciaKey} onChange={(e) => setFrecuenciaKey(e.target.value)}>
          {FRECUENCIAS.map((f) => (
            <option key={f.valor} value={f.valor}>{f.label}</option>
          ))}
        </Form.Select>
        {frecuenciaKey === 'personalizado' && (
          <Form.Control className="mt-2" type="number" min="1" max="168"
            placeholder="Cada cuántas horas (ej: 8)"
            value={intervaloPersonalizado} onChange={(e) => setIntervaloPersonalizado(e.target.value)} />
        )}
      </Form.Group>

      {/* Hora de inicio */}
      <Form.Group className="mb-3">
        <Form.Label>Hora de inicio <span className="text-muted fw-normal">(opcional)</span></Form.Label>
        <Form.Control type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} />
      </Form.Group>

      {/* Preview de dosis */}
      {horaInicio && intervaloHoras && (
        <div className="mb-3">
          <DosePreview horaInicio={horaInicio} intervaloHoras={intervaloHoras} />
        </div>
      )}

      {/* Duración */}
      <Form.Group className="mb-3">
        <Form.Label>Duración del tratamiento</Form.Label>
        <Form.Select value={duracionKey} onChange={(e) => setDuracionKey(e.target.value)}>
          {DURACIONES.map((d) => (
            <option key={d.valor} value={d.valor}>{d.label}</option>
          ))}
        </Form.Select>
        {duracionKey === 'personalizado' && (
          <Form.Control className="mt-2" type="number" min="1"
            placeholder="Número de días"
            value={duracionPersonalizada} onChange={(e) => setDuracionPersonalizada(e.target.value)} />
        )}
      </Form.Group>

      <Button variant="primary" type="submit" disabled={loading}>
        {loading ? 'Guardando...' : 'Guardar'}
      </Button>
    </Form>
  );
}

export default FormularioDeMedicamento;
