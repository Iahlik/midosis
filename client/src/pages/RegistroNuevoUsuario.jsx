import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'animate.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function RegistroNuevoUsuario() {
  const [nombre, setNombre] = useState('');
  const [correo_electronico, setCorreoElectronico] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (contrasena.length < 6 || correo_electronico.trim() === '') {
      setError('La contraseña debe tener al menos 6 caracteres y el correo no puede estar vacío.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, correo_electronico, contrasena }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/login');
      } else {
        setError(data.error || 'Error al registrar. Inténtalo de nuevo.');
      }
    } catch (err) {
      setError('Error al conectar con el servidor. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="animate__animated animate__fadeIn mt-5 mb-5">
      <h1>Registro de Nuevo Usuario</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="nombre" className="mb-3">
          <Form.Label>Nombre de Usuario</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese su nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="correo" className="mb-3">
          <Form.Label>Correo Electrónico</Form.Label>
          <Form.Control
            type="email"
            placeholder="Ingrese su correo electrónico"
            value={correo_electronico}
            onChange={(e) => setCorreoElectronico(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="contrasena" className="mb-3">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />
        </Form.Group>

        {error && <Alert variant="danger">{error}</Alert>}

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </Button>
      </Form>
    </Container>
  );
}

export default RegistroNuevoUsuario;
