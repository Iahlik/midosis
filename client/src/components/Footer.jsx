import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "animate.css";
import '../assets/css/Footer.css';

function Footer() {
  return (
    <footer className="bg-dark text-light py-4">
      <Container>
        <Row>
          <Col lg={4} md={6}>
            <h5>Enlaces Rápidos</h5>
            <ul className="list-unstyled">
              <li><a href="/">Inicio</a></li>
              <li><a href="/perfil-usuario">Perfil de Usuario</a></li>
              <li><a href="/ayuda">Ayuda</a></li>
              <li><a href="/configuracion">Configuración</a></li>
            </ul>
          </Col>
          <Col lg={4} md={6}>
            <h5>Contacto</h5>
            <p>Si tienes alguna pregunta o comentario, no dudes en contactarnos.</p>
            <p>Email: info@midosis.com</p>
          </Col>
          <Col lg={4} md={12}>
            <h5>Síguenos</h5>
            <ul className="list-unstyled social-icons d-flex justify-content-start gap-3">
              <li><a href="https://www.linkedin.com/in/ignacio-larra%C3%ADn-villegas-13091565/"><i className="fa fa-linkedin fa-lg"></i></a></li> {/* Agregar ícono de LinkedIn */}
              <li><a href="https://github.com/Iahlik"><i className="fa fa-github fa-lg"></i></a></li> {/* Agregar ícono de GitHub */}
            </ul>
          </Col>
        </Row>
      </Container>
      <div className="text-center py-3">
        &copy; {new Date().getFullYear()} MiDosis - Todos los derechos reservados
      </div>
    </footer>
  );
}

export default Footer;
