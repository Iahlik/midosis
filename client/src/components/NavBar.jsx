// src/components/NavBar.jsx
import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

function NavBar() {
  const { user, isLoggedIn, handleLogout } = useAuth();

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">MiDosis</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav>
            {!isLoggedIn && (
              <>
                <Nav.Link as={Link} to="/login">Iniciar Sesión</Nav.Link>
                <Nav.Link as={Link} to="/registro-nuevo-usuario">Registro</Nav.Link>
              </>
            )}
            {isLoggedIn && (
              <>
                <Nav.Link as={Link} to="/perfil-usuario">
                  {user?.nombre || 'Perfil'}
                </Nav.Link>
                <Nav.Link onClick={handleLogout} as={Link} to="/">Cerrar Sesión</Nav.Link>
              </>
            )}
            <Nav.Link as={Link} to="/ayuda">Ayuda</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
