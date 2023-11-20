import React, { useEffect } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import "animate.css";

const Login = () => {
  const {
    user,
    error,
    email,
    setEmail,
    password,
    setPassword,
    handleSubmit,
    handleLogout,
  } = useAuth();
  const navigate = useNavigate();

  // Imprime el estado del usuario cada vez que cambia
  useEffect(() => {
    console.log("Historial de navegación:", navigate);
    console.log("Usuario:", user);
  }, [user]);

  // Imprime el estado del correo electrónico y la contraseña cada vez que cambian
  useEffect(() => {
    console.log("Email:", email);
  }, [email]);

  useEffect(() => {
    console.log("Password:", password);
  }, [password]);

  useEffect(() => {
    // Función para manejar la redirección después de iniciar sesión
    const redirectToProfile = () => {
      console.log("Redirigiendo a perfil...");
      if (user && typeof user === "object") {
        console.log("Usuario autenticado:", user);
        navigate("/perfil-usuario");
      }
    };

    redirectToProfile(); // Redirige automáticamente si ya hay un usuario autenticado
  }, [user, navigate]);

  if (user && typeof user === "object") {
    return (
      <div>
        <p>Bienvenido, {user ? user.nombre : "usuario"}!</p>
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
        <Form onSubmit={(e) => handleSubmit(e, "login")}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Ingresa tu email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                console.log("Email actualizado:", e.target.value);
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                console.log("Contraseña verificada:", e.target.value);
              }}
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
