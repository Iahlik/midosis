import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

function FormularioDeMedicamento({ onSave, initialData }) {
  const [nombre, setNombre] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [intervalo, setIntervalo] = useState('');
  const [frecuencia, setFrecuencia] = useState('');

  useEffect(() => {
    if (initialData) {
      setNombre(initialData.nombre || '');
      setCantidad(initialData.cantidadMg || '');
      setIntervalo(initialData.intervaloHoras || '');
      setFrecuencia(initialData.frecuenciaDias || '');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nombre || !cantidad || !intervalo || !frecuencia) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const medicamento = {
      nombre,
      cantidadMg: Number(cantidad),
      intervaloHoras: Number(intervalo),
      frecuenciaDias: Number(frecuencia),
    };

    if (initialData?.id) {
      medicamento.id = initialData.id; // incluir ID si es edición
    }

    onSave(medicamento);

    setNombre('');
    setCantidad('');
    setIntervalo('');
    setFrecuencia('');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Nombre del Medicamento</Form.Label>
        <Form.Control
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Cantidad (mg)</Form.Label>
        <Form.Control
          type="number"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Intervalo (horas)</Form.Label>
        <Form.Control
          type="number"
          value={intervalo}
          onChange={(e) => setIntervalo(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Frecuencia (días)</Form.Label>
        <Form.Control
          type="number"
          value={frecuencia}
          onChange={(e) => setFrecuencia(e.target.value)}
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Guardar
      </Button>
    </Form>
  );
}

export default FormularioDeMedicamento;
