import React from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import 'animate.css';

function Configuracion() {
  return (
    <Container className="animate__animated animate__fadeIn">
      <h1>Configuración</h1>
      <Form>
        {/* Agrega opciones de configuración aquí */}
        <Button variant="primary" type="submit">Guardar</Button>
      </Form>
    </Container>
  );
}

export default Configuracion;
