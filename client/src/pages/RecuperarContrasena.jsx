import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import 'animate.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function RecuperarContrasena() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/recuperar-contrasena`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      // Siempre mostramos el mismo mensaje para no revelar si el email existe
      setEnviado(true);
    } catch {
      setError('Error al conectar con el servidor. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (enviado) {
    return (
      <Container className="animate__animated animate__fadeIn mt-5" style={{ maxWidth: '480px' }}>
        <Alert variant="success">
          <Alert.Heading>Revisa tu correo</Alert.Heading>
          <p>
            Si existe una cuenta con ese email, recibirás un enlace para restablecer
            tu contraseña en los próximos minutos.
          </p>
        </Alert>
        <div className="text-center">
          <a href="/login">Volver al inicio de sesión</a>
        </div>
      </Container>
    );
  }

  return (
    <Container className="animate__animated animate__fadeIn mt-5" style={{ maxWidth: '480px' }}>
      <h1 className="mb-2">Recuperar contraseña</h1>
      <p className="text-muted mb-4">
        Ingresa tu correo y te enviaremos un enlace para crear una nueva contraseña.
      </p>

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email" className="mb-3">
          <Form.Label>Correo Electrónico</Form.Label>
          <Form.Control
            type="email"
            placeholder="tucorreo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        {error && <Alert variant="danger">{error}</Alert>}

        <div className="d-grid">
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
          </Button>
        </div>

        <div className="text-center mt-3">
          <a href="/login">Volver al inicio de sesión</a>
        </div>
      </Form>
    </Container>
  );
}

export default RecuperarContrasena;
