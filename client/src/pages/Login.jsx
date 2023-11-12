import React from "react";
import { Button, Form, Alert } from "react-bootstrap";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import "animate.css";

const Login = () => {
  const { user, error, email, setEmail, password, setPassword, handleSubmit, handleLogout } = useAuth();
  const navigate = useNavigate();

   // Función para manejar la redirección después de iniciar sesión
   const redirectToProfile = () => {
    navigate('/perfil-usuario'); // Cambia '/perfil' por la ruta real de tu página de Perfil
  };

  if (user) {
    redirectToProfile(); // Redirige automáticamente si ya hay un usuario autenticado
    return (
      <div>
        <p>Bienvenido, {user ? user.nombre : 'usuario'}!</p>
        <Button onClick={handleLogout} variant="primary btn-dark">
          Cerrar sesión
        </Button>
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="col-md-5 mx-auto border border-dark rounded p-5 animate__animated animate__fadeIn">
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
            <Button type="submit" variant="primary btn-dark mb-3">
              Enviar
            </Button>
          </div>
        </Form>
        {error ? <Alert variant="danger">{error}</Alert> : null}
      </div>
    </div>
  );
};

export default Login;
