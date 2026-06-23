import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link, Navigate } from 'react-router-dom';
import { FaSignInAlt, FaUserPlus, FaPills, FaBell, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthProvider';
import midosisLogo from '../assets/img/midosis-logo.png';
import 'animate.css';

const features = [
  { icon: <FaPills />, text: 'Registra medicamentos con dosis y horario' },
  { icon: <FaBell />, text: 'Recibe recordatorios en tu teléfono' },
  { icon: <FaCheckCircle />, text: 'Organiza tu rutina de salud diaria' },
];

function Home() {
  const { isLoggedIn } = useAuth();
  if (isLoggedIn) return <Navigate to="/perfil-usuario" replace />;

  return (
    <Container className="animate__animated animate__fadeIn home-hero text-center">
      <img src={midosisLogo} alt="MiDosis Logo" className="home-logo" />
      <h1 className="home-title">MiDosis</h1>
      <p className="home-tagline">Tu asistente de medicamentos. Simple, claro y siempre contigo.</p>

      <div className="d-flex flex-column align-items-center gap-2 mb-4">
        {features.map((f, i) => (
          <div key={i} className="home-feature">
            <span className="home-feature-icon">{f.icon}</span>
            <span className="text-muted">{f.text}</span>
          </div>
        ))}
      </div>

      <Row className="justify-content-center g-3 mb-5" style={{ maxWidth: 420, margin: '0 auto' }}>
        <Col xs={12}>
          <Link to="/login" className="btn btn-primary w-100 py-3 d-flex align-items-center justify-content-center gap-2 lift">
            <FaSignInAlt size={18} />
            <span className="fw-semibold">Iniciar Sesión</span>
          </Link>
        </Col>
        <Col xs={12}>
          <Link to="/registro-nuevo-usuario" className="btn btn-outline-secondary w-100 py-2 d-flex align-items-center justify-content-center gap-2 lift">
            <FaUserPlus size={16} />
            <span>Crear cuenta</span>
          </Link>
        </Col>
      </Row>

      <p className="text-muted small">
        <Link to="/ayuda" className="text-muted">¿Tienes dudas? Visita la sección de Ayuda</Link>
      </p>
    </Container>
  );
}

export default Home;
