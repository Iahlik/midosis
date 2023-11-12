// RegistroNuevoUsuario.jsx

import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import "animate.css";

function RegistroNuevoUsuario() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de contraseñas u otros campos, si es necesario
    if (contrasena.length < 6 || correo.trim() === "") {
    setError("La contraseña debe tener al menos 6 caracteres y el correo electrónico no puede estar vacío");
    return;
  }

    // Realiza la lógica para enviar los datos al servidor
    try {
      const response = await fetch("http://localhost:3000/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre, correo, contrasena }),
      });

      console.log("Response:", response);  // Agrega este console.log


      if (response.status === 200) {
        // Registro exitoso, redirige al usuario a la página de inicio de sesión
        window.location.href = "/perfil-usuario";
      } else {
        setError("Error al registrar. Inténtalo de nuevo.");
      }
    } catch (error) {
      console.error("Error al registrar:", error);  // Agrega este console.error
      setError("Error al registrar. Inténtalo de nuevo.");
    }
  };

  return (
    <Container className="animate__animated animate__fadeIn mt-5 mb-5">
      <h1>Registro de Nuevo Usuario</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="nombre">
          <Form.Label>Nombre de Usuario</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese su nombre de Usuario"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="correo">
          <Form.Label>Correo Electrónico</Form.Label>
          <Form.Control
            type="email"
            placeholder="Ingrese su correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="contrasena">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            placeholder="Ingrese su contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />
        </Form.Group>
        {error && <Alert variant="danger">{error}</Alert>}
        <div className="container mt-5">
          <Button variant="primary" type="submit">
            Registrarse
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default RegistroNuevoUsuario;
