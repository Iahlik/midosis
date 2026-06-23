import React from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--md-navy)', color: 'rgba(255,255,255,0.7)' }} className="py-3">
      <Container className="d-flex flex-column flex-sm-row align-items-center justify-content-between gap-2">
        <span className="small">&copy; {new Date().getFullYear()} MiDosis</span>

        <div className="d-flex gap-3 small">
          <Link to="/" style={{ color: 'rgba(255,255,255,0.6)' }} className="text-decoration-none">Inicio</Link>
          <Link to="/ayuda" style={{ color: 'rgba(255,255,255,0.6)' }} className="text-decoration-none">Ayuda</Link>
          <Link to="/configuracion" style={{ color: 'rgba(255,255,255,0.6)' }} className="text-decoration-none">Configuración</Link>
        </div>

        <div className="d-flex gap-3">
          <a href="https://github.com/Iahlik" target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <FaGithub size={18} />
          </a>
          <a href="https://www.linkedin.com/in/ignacio-larra%C3%ADn-villegas-13091565/" target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <FaLinkedin size={18} />
          </a>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
