import React, { useState, useEffect } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import "animate.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/perfil-usuario");
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/perfil-usuario");
    } catch (err) {
      setError("Credenciales inválidas o usuario no registrado.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="col-md-5 mx-auto border border-dark rounded p-5 animate__animated animate__fadeIn">
        <h1 className="mt-3">Login</h1>
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Ingresa tu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
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
              Iniciar sesión
            </Button>
          </div>
        </Form>
        {error && <Alert variant="danger">{error}</Alert>}
      </div>
    </div>
  );
};

export default Login;
