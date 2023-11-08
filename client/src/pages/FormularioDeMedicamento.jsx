import React from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import 'animate.css';

function FormularioDeMedicamento() {
  return (
    <Container className="animate__animated animate__fadeIn">
      <h1>Formulario de Medicamento</h1>
      <Form>
        {/* Agrega campos de formulario para medicamentos aquí */}
        <Button variant="primary" type="submit">Guardar</Button>
      </Form>
    </Container>
  );
}

export default FormularioDeMedicamento;
