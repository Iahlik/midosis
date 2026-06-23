import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { calcularFortaleza, nivelFortaleza } from '../utils/passwordStrength';
import { ProgressBar } from 'react-bootstrap';
import 'animate.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function RestablecerContrasena() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [contrasena, setContrasena] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [mostrar, setMostrar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!token) {
    return (
      <Container className="mt-5" style={{ maxWidth: '480px' }}>
        <Alert variant="danger">
          Enlace inválido o expirado. Solicita uno nuevo desde{' '}
          <a href="/recuperar-contrasena">recuperar contraseña</a>.
        </Alert>
      </Container>
    );
  }

  const fortaleza = calcularFortaleza(contrasena);
  const nivel = nivelFortaleza(fortaleza);
  const noCoinciden = confirmar && contrasena !== confirmar;
  const coinciden = confirmar && contrasena === confirmar;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (contrasena !== confirmar) { setError('Las contraseñas no coinciden.'); return; }
    if (contrasena.length < 6) { setError('La contraseña debe tener al menos 6 caracteres.'); return; }

    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/restablecer-contrasena`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, contrasena }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/login');
      } else {
        setError(data.error || 'El enlace es inválido o ha expirado.');
      }
    } catch {
      setError('Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="animate__animated animate__fadeIn mt-5" style={{ maxWidth: '480px' }}>
      <h1 className="mb-4">Nueva contraseña</h1>
      <Form onSubmit={handleSubmit}>

        <Form.Group className="mb-1">
          <Form.Label>Nueva contraseña</Form.Label>
          <div className="input-group">
            <Form.Control
              type={mostrar ? 'text' : 'password'}
              placeholder="Mínimo 6 caracteres"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />
            <Button variant="outline-secondary" onClick={() => setMostrar(!mostrar)} tabIndex={-1}>
              {mostrar ? <FaEyeSlash /> : <FaEye />}
            </Button>
          </div>
        </Form.Group>

        {contrasena.length > 0 && (
          <div className="mb-3">
            <ProgressBar now={nivel.valor} variant={nivel.variant} style={{ height: '6px' }} className="mb-1" />
            <small className={`text-${nivel.variant}`}>Fortaleza: {nivel.label}</small>
          </div>
        )}

        <Form.Group className="mb-3">
          <Form.Label>Confirmar contraseña</Form.Label>
          <Form.Control
            type="password"
            placeholder="Repite tu contraseña"
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
            isValid={coinciden}
            isInvalid={noCoinciden}
            required
          />
          <Form.Control.Feedback type="invalid">Las contraseñas no coinciden.</Form.Control.Feedback>
          <Form.Control.Feedback type="valid">Las contraseñas coinciden.</Form.Control.Feedback>
        </Form.Group>

        {error && <Alert variant="danger">{error}</Alert>}

        <div className="d-grid">
          <Button variant="primary" type="submit" disabled={loading || noCoinciden}>
            {loading ? 'Guardando...' : 'Guardar nueva contraseña'}
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default RestablecerContrasena;
