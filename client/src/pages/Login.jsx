import React, { useState } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import "animate.css";

export const Login = () => {
  const { isLoggedIn, error, email, setEmail, password, setPassword, handleSubmit, handleLogout } = useAuth();
  const navigate = useNavigate(); // Hook para manejar la redirección

  const handleRedirectToHome = () => {
    navigate('/'); // Redirige a la página /home al hacer clic en el botón
  };

  if (isLoggedIn) {
    return (
      <div>
        {/* Puedes personalizar el contenido para el usuario autenticado aquí */}
        <p>Bienvenido, usuario!</p>
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
        <Form onSubmit={handleSubmit}>
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
            <Button onClick={handleSubmit} variant="primary btn-dark mb-3" type="submit">
              Enviar
            </Button>
          </div>
        </Form>
        {error ? <Alert variant="danger">{error}</Alert> : null}
      </div>
    </div>
  );
}

export default Login;
