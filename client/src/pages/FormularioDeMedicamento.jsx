import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

function FormularioDeMedicamento({ onSave }) {
  const [nombre, setNombre] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [intervalo, setIntervalo] = useState('');
  const [frecuencia, setFrecuencia] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación básica
    if (!nombre || !cantidad || !intervalo || !frecuencia) {
      alert('Por favor, completa todos los campos del formulario.');
      return;
    }

    const nuevoMedicamento = {
      nombre_medicamento: nombre,
      cantidad_mg: cantidad,
      intervalo_horas: intervalo,
      cada_cuanto_dias: frecuencia,
    };

    // Llama a la función onSave para guardar el nuevo medicamento
    onSave(nuevoMedicamento);

    // Reinicia los campos del formulario después de guardar
    setNombre('');
    setCantidad('');
    setIntervalo('');
    setFrecuencia('');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="nombreMedicamento">
        <Form.Label>Nombre del Medicamento</Form.Label>
        <Form.Control
          type="text"
          placeholder="Ingrese el nombre del medicamento"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="cantidadMedicamento">
        <Form.Label>Cantidad (mg)</Form.Label>
        <Form.Control
          type="number"
          placeholder="Ingrese la cantidad en miligramos"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="intervaloMedicamento">
        <Form.Label>Intervalo (horas)</Form.Label>
        <Form.Control
          type="number"
          placeholder="Ingrese el intervalo en horas"
          value={intervalo}
          onChange={(e) => setIntervalo(e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="frecuenciaMedicamento">
        <Form.Label>Frecuencia (días)</Form.Label>
        <Form.Control
          type="number"
          placeholder="Ingrese la frecuencia en días"
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
