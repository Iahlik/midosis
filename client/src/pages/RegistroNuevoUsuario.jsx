import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';

function RegistroNuevoUsuario() {
  const { register } = useAuth();
  const [form, setForm] = useState({ email: '', password: '', nombre: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(form.email, form.password, form.nombre);
      setSuccess('Registro exitoso.');
      setTimeout(() => navigate('/perfil-usuario'), 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container className="mt-5">
      <h2>Registro de Usuario</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            name="nombre"
            onChange={handleChange}
            value={form.nombre}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control
            name="email"
            type="email"
            onChange={handleChange}
            value={form.email}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            name="password"
            type="password"
            onChange={handleChange}
            value={form.password}
          />
        </Form.Group>
        <Button type="submit" className="mt-3">Registrarse</Button>
      </Form>
    </Container>
  );
}
export default RegistroNuevoUsuario;
