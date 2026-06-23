import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useAuth } from "../context/AuthProvider";
import logo from "../assets/img/mdlogobg.png";
import "animate.css";

function NavBar() {
  const { isLoggedIn, user, handleLogout } = useAuth();

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img
            src={logo}
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
      {user && user.nombre ? user.nombre : 'Perfil'}
    </Nav.Link>
    <Nav.Link as={Link} to="/ajustes-alarma" className="text-white">
      Alarmas
    </Nav.Link>
    <Nav.Link as={Link} to="/configuracion" className="text-white">
      Configuración
    </Nav.Link>
    <Link to="/" className="nav-link text-white" onClick={handleLogout}>
      Cerrar Sesión
    </Link>
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
