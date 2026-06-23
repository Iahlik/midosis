import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthProvider';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function FormularioDeMedicamento({ onSave }) {
  const { user, token } = useAuth();
  const [catalogo, setCatalogo] = useState([]);
  const [medicamentoId, setMedicamentoId] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [intervalo, setIntervalo] = useState('');
  const [frecuencia, setFrecuencia] = useState('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!medicamentoId || !cantidad || !intervalo || !frecuencia) {
      setError('Por favor completa todos los campos.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/medicamentos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          usuario_id: user.id,
          medicamento_id: parseInt(medicamentoId),
          cantidad_mg: parseFloat(cantidad),
          intervalo_horas: parseInt(intervalo),
          cada_cuanto_dias: parseInt(frecuencia),
        }),
      });

      if (!res.ok) throw new Error();

      // Recarga los medicamentos del usuario para obtener datos completos con dosis_id
      const medsRes = await fetch(`${API_URL}/medicamentos/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const meds = await medsRes.json();
      const ultimo = meds[meds.length - 1];

      onSave(ultimo);

      setCantidad('');
      setIntervalo('');
      setFrecuencia('');
      setMedicamentoId('');
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

      <Form.Group className="mb-3">
        <Form.Label>Medicamento</Form.Label>
        <Form.Select
          value={medicamentoId}
          onChange={(e) => setMedicamentoId(e.target.value)}
          required
        >
          <option value="">Selecciona un medicamento...</option>
          {catalogo.map((m) => (
            <option key={m.medicamento_id} value={m.medicamento_id}>
              {m.nombre}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Cantidad (mg)</Form.Label>
        <Form.Control
          type="number"
          min="0.1"
          step="0.1"
          placeholder="Ej: 500"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Intervalo (horas)</Form.Label>
        <Form.Control
          type="number"
          min="1"
          max="72"
          placeholder="Ej: 8 (cada 8 horas)"
          value={intervalo}
          onChange={(e) => setIntervalo(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Frecuencia (días)</Form.Label>
        <Form.Control
          type="number"
          min="1"
          placeholder="Ej: 7 (por 7 días)"
          value={frecuencia}
          onChange={(e) => setFrecuencia(e.target.value)}
          required
        />
      </Form.Group>

      <Button variant="primary" type="submit" disabled={loading}>
        {loading ? 'Guardando...' : 'Guardar'}
      </Button>
    </Form>
  );
}

export default FormularioDeMedicamento;
