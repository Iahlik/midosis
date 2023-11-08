import React from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import 'animate.css';
import '../assets/css/PerfilDeUsuario.css';

function PerfilDeUsuario() {
  return (
    <Container className="perfil-container animate__animated animate__fadeIn mb-5">
      <h1>Perfil de Usuario</h1>
      <Form>
        {/* Agrega campos de perfil de usuario aquí */}
        <Button variant="primary" type="submit">Guardar</Button>
      </Form>
    </Container>
  );
}

export default PerfilDeUsuario;
