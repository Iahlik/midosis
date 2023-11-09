import React, { useState } from "react";
import { useAuth } from '../context/AuthContext';
import { Container, Form, Button, Alert } from "react-bootstrap";
import "animate.css";

function Login() {
    const { login } = useAuth(); // Accede a la función de inicio de sesión desde el contexto de autenticación
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null); // Define el estado de error

  const handleLogin = async (e) => {
    e.preventDefault();

    // Realiza la lógica para enviar los datos de inicio de sesión al servidor
    try {
      const response = await fetch("/api/iniciar-sesion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 200) {
        // Inicio de sesión exitoso, redirige al usuario a la página principal
        window.location.href = "/";
      } else {
        setError("Credenciales incorrectas. Inténtalo de nuevo.");
      }
    } catch (error) {
      setError("Error al iniciar sesión. Inténtalo de nuevo.");
    }
  };

  return (
    <Container className="animate__animated animate__fadeIn mt-5 mb-5">
      <h1>Iniciar sesión</h1>
      <Form onSubmit={handleLogin}>
        <Form.Group controlId="email">
          <Form.Label>Correo Electrónico</Form.Label>
          <Form.Control
            type="email"
            placeholder="Ingrese su correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            placeholder="Ingrese su contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        {error && <Alert variant="danger">{error}</Alert>}
        <div className="container mt-5">
          <Button variant="primary" type="submit">
            Iniciar sesión
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default Login;
