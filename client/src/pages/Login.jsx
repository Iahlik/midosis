import React from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthProvider';
import 'animate.css';

const Login = () => {
  const { error, email, setEmail, password, setPassword, handleSubmit } = useAuth();

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="col-11 col-md-5 mx-auto border border-dark rounded p-4 p-md-5 animate__animated animate__fadeIn">
        <h1 className="mt-3">Login</h1>
        <Form onSubmit={(e) => handleSubmit(e, 'login')}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Ingresa tu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <div className="d-flex justify-content-center">
            <Button type="submit" variant="dark" className="mb-3">
              Iniciar sesión
            </Button>
          </div>
        </Form>
        {error && <Alert variant="danger">{error}</Alert>}
        <div className="text-center mt-2">
          <small><a href="/recuperar-contrasena">¿Olvidaste tu contraseña?</a></small>
        </div>
      </div>
    </div>
  );
};

export default Login;
