import React, { useState } from 'react';
import { Container, Form, Button, Alert, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import 'animate.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

import { calcularFortaleza, nivelFortaleza } from '../utils/passwordStrength';

function RegistroNuevoUsuario() {
  const [nombre, setNombre] = useState('');
  const [correo_electronico, setCorreoElectronico] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fortaleza = calcularFortaleza(contrasena);
  const nivel = nivelFortaleza(fortaleza);
  const contrasenasCoinciden = contrasena && confirmarContrasena && contrasena === confirmarContrasena;
  const contrasenasNoCoinciden = confirmarContrasena && contrasena !== confirmarContrasena;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (contrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (correo_electronico.trim() === '') {
      setError('El correo electrónico no puede estar vacío.');
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
    } catch {
      setError('Error al conectar con el servidor. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="animate__animated animate__fadeIn mt-5 mb-5" style={{ maxWidth: '480px' }}>
      <h1 className="mb-4">Registro</h1>
      <Form onSubmit={handleSubmit}>

        <Form.Group controlId="nombre" className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            placeholder="Tu nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="correo" className="mb-3">
          <Form.Label>Correo Electrónico</Form.Label>
          <Form.Control
            type="email"
            placeholder="tucorreo@ejemplo.com"
            value={correo_electronico}
            onChange={(e) => setCorreoElectronico(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="contrasena" className="mb-1">
          <Form.Label>Contraseña</Form.Label>
          <div className="input-group">
            <Form.Control
              type={mostrarContrasena ? 'text' : 'password'}
              placeholder="Mínimo 6 caracteres"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />
            <Button
              variant="outline-secondary"
              onClick={() => setMostrarContrasena(!mostrarContrasena)}
              tabIndex={-1}
            >
              {mostrarContrasena ? <FaEyeSlash /> : <FaEye />}
            </Button>
          </div>
        </Form.Group>

        {contrasena.length > 0 && (
          <div className="mb-3">
            <ProgressBar
              now={nivel.valor}
              variant={nivel.variant}
              style={{ height: '6px' }}
              className="mb-1"
            />
            <small className={`text-${nivel.variant}`}>
              Fortaleza: {nivel.label}
            </small>
            <div className="mt-1">
              <small className="text-muted d-block">
                {!/[A-Z]/.test(contrasena) && '· Agrega una mayúscula '}
                {!/[0-9]/.test(contrasena) && '· Agrega un número '}
                {!/[^A-Za-z0-9]/.test(contrasena) && '· Agrega un símbolo (!@#$...)'}
              </small>
            </div>
          </div>
        )}

        <Form.Group controlId="confirmarContrasena" className="mb-3">
          <Form.Label>Confirmar Contraseña</Form.Label>
          <div className="input-group">
            <Form.Control
              type={mostrarConfirmar ? 'text' : 'password'}
              placeholder="Repite tu contraseña"
              value={confirmarContrasena}
              onChange={(e) => setConfirmarContrasena(e.target.value)}
              isValid={contrasenasCoinciden}
              isInvalid={contrasenasNoCoinciden}
              required
            />
            <Button
              variant="outline-secondary"
              onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
              tabIndex={-1}
            >
              {mostrarConfirmar ? <FaEyeSlash /> : <FaEye />}
            </Button>
            <Form.Control.Feedback type="invalid">
              Las contraseñas no coinciden.
            </Form.Control.Feedback>
            <Form.Control.Feedback type="valid">
              Las contraseñas coinciden.
            </Form.Control.Feedback>
          </div>
        </Form.Group>

        {error && <Alert variant="danger">{error}</Alert>}

        <div className="d-grid">
          <Button variant="primary" type="submit" disabled={loading || contrasenasNoCoinciden}>
            {loading ? 'Registrando...' : 'Registrarse'}
          </Button>
        </div>

        <div className="text-center mt-3">
          <small>¿Ya tienes cuenta? <a href="/login">Inicia sesión</a></small>
        </div>
      </Form>
    </Container>
  );
}

export default RegistroNuevoUsuario;
