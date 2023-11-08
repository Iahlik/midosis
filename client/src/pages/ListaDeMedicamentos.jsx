import React from 'react';
import { Container, ListGroup } from 'react-bootstrap';
import 'animate.css';

function ListaDeMedicamentos() {
  return (
    <Container className="animate__animated animate__fadeIn">
      <h1>Lista de Medicamentos</h1>
      <ListGroup>
        {/* Muestra la lista de medicamentos registrados aquí */}
      </ListGroup>
    </Container>
  );
}

export default ListaDeMedicamentos;
