import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import "animate.css";

function NavBar() {
  // Simula el estado de autenticación (puedes adaptarlo a tu lógica real)
  const isAuthenticated = false; // Cambia a true si el usuario está autenticado

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img
            src="src/assets/img/mdlogobg.png"
            alt="MiDosis Logo"
            width="40"
            height="40"
            className="mr-2"
          />
          <span style={{ marginLeft: "8px" }}>MiDosis</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="ml-auto justify-content-end">
            {!isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/login" className="text-white">
                  Iniciar Sesión
                </Nav.Link>
                <Nav.Link as={Link} to="/registro-nuevo-usuario" className="text-white">
                  Registro
                </Nav.Link>
              </>
            )}
            {isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/perfil-usuario" className="text-white">
                  Perfil de Usuario
                </Nav.Link>
                <Button variant="outline-light" as={Link} to="/cerrar-sesion">
                  Cerrar Sesión
                </Button>
              </>
            )}
            <Nav.Link as={Link} to="/ayuda" className="text-white">
              Ayuda
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
