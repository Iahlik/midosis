import React from 'react';
import { Container, Button } from 'react-bootstrap';
import 'animate.css';

function AjustesDeAlarma() {
  return (
    <Container className="animate__animated animate__fadeIn">
      <h1>Ajustes de Alarma</h1>
      {/* Agrega contenido y configuración de alarmas aquí */}
      <Button variant="primary">Guardar</Button>
    </Container>
  );
}

export default AjustesDeAlarma;