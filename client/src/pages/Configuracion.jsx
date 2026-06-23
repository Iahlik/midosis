import React, { useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthProvider';
import 'animate.css';

function Configuracion() {
  const { user, updateUser } = useAuth();

  const [nombre, setNombre] = useState(user?.nombre || '');
  const [savingNombre, setSavingNombre] = useState(false);

  const [contrasenaActual, setContrasenaActual] = useState('');
  const [contrasenaNueva, setContrasenaNueva] = useState('');
  const [contrasenaConfirm, setContrasenaConfirm] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const handleSaveNombre = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    setSavingNombre(true);
    try {
      await updateUser({ nombre });
      toast.success('Nombre actualizado correctamente');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingNombre(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (contrasenaNueva !== contrasenaConfirm) {
      toast.error('Las contraseñas nuevas no coinciden');
      return;
    }
    setSavingPassword(true);
    try {
      await updateUser({ contrasena_actual: contrasenaActual, contrasena_nueva: contrasenaNueva });
      toast.success('Contraseña actualizada correctamente');
      setContrasenaActual('');
      setContrasenaNueva('');
      setContrasenaConfirm('');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <Container className="animate__animated animate__fadeIn mt-4 mb-5" style={{ maxWidth: '540px' }}>
      <h1 className="mb-4">Configuración</h1>

      {user && (
        <p className="text-muted mb-4">
          Cuenta: <strong>{user.correo_electronico}</strong>
        </p>
      )}

      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Cambiar nombre</Card.Title>
          <Form onSubmit={handleSaveNombre}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary" disabled={savingNombre}>
              {savingNombre ? 'Guardando...' : 'Guardar nombre'}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <Card.Title>Cambiar contraseña</Card.Title>
          <Form onSubmit={handleSavePassword}>
            <Form.Group className="mb-3">
              <Form.Label>Contraseña actual</Form.Label>
              <Form.Control
                type="password"
                value={contrasenaActual}
                onChange={(e) => setContrasenaActual(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nueva contraseña</Form.Label>
              <Form.Control
                type="password"
                value={contrasenaNueva}
                onChange={(e) => setContrasenaNueva(e.target.value)}
                minLength={6}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirmar nueva contraseña</Form.Label>
              <Form.Control
                type="password"
                value={contrasenaConfirm}
                onChange={(e) => setContrasenaConfirm(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary" disabled={savingPassword}>
              {savingPassword ? 'Guardando...' : 'Cambiar contraseña'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Configuracion;
