import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useAuth } from "../context/AuthProvider";
import "animate.css";

function NavBar() {
  const { isLoggedIn, user, handleLogout } = useAuth();

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
            {!isLoggedIn && (
              <>
                <Nav.Link as={Link} to="/login" className="text-white">
                  Iniciar Sesión
                </Nav.Link>
                <Nav.Link as={Link} to="/registro-nuevo-usuario" className="text-white">
                  Registro
                </Nav.Link>
              </>
            )}
            {isLoggedIn && (
              <>
                <Nav.Link as={Link} to="/perfil-usuario" className="text-white">
                  {user ? user.nombre : 'Perfil de Usuario'}
                </Nav.Link>
                <Button onClick={handleLogout} variant="outline-light" as={Link} to="/cerrar-sesion">
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
