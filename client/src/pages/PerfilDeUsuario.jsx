import React, { useEffect, useState, useCallback  } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Table, Modal } from 'react-bootstrap';
import { useAuth } from '../context/AuthProvider';
import FormularioDeMedicamento from './FormularioDeMedicamento';
import 'animate.css';
import '../assets/css/PerfilDeUsuario.css';

function PerfilDeUsuario() {
  const { user, token, fetchMedicamentos } = useAuth();
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMedicamento, setSelectedMedicamento] = useState(null);
  const navigate = useNavigate(); 


  const fetchData = useCallback(async () => {
    try {
      if (!user || !user.id) {
        // Redirige al usuario al inicio de sesión si no está autenticado o si no tiene un ID válido
        navigate('/perfil-usuario');
        return;
      }

      console.log('Usuario Autenticado:', user);

      // Llamada para obtener medicamentos al cargar el perfil de usuario
      const data = await fetchMedicamentos(parseInt(user.id, 10), token);
      setMedicamentos(data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener medicamentos:', error);
      setLoading(false);
    }
  }, [user, token, fetchMedicamentos, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddMedicamento = () => {
    setShowAddModal(true);
  };

  const handleEditMedicamento = medicamento => {
    setSelectedMedicamento(medicamento);
    setShowEditModal(true);
  };

  const handleDeleteMedicamento = medicamento => {
    const confirmDelete = window.confirm('¿Estás seguro de eliminar este medicamento?');

    if (confirmDelete) {
      // Lógica para eliminar el medicamento
      // Puedes hacer una solicitud DELETE al servidor
    }
  };

  const handleSaveMedicamento = (medicamento) => {
    // Lógica para guardar el nuevo medicamento
    // Puedes hacer una solicitud POST al servidor
    // Además, después de agregar el medicamento, cierra el modal de agregar
    setMedicamentos([...medicamentos, medicamento]);
    setShowAddModal(false);
  };
/* 
  if (!user || loading) {
    return <p>Cargando...</p>;
  } */

/*   console.log('Medicamentos:', medicamentos);
  console.log('Usuario:', user); */

  return (
    <Container className="perfil-container animate__animated animate__fadeIn mb-5">
      <h1>Perfil de Usuario</h1>
      <h2>Medicamentos</h2>
      {(!medicamentos || medicamentos.length === 0) ? (
  <div className="text-center"> {/* Agrega la clase text-center para centrar el contenido */}
    <p>No has registrado ningún medicamento.</p>
    <Button variant="success" onClick={handleAddMedicamento}>
      Agregar Medicamento
    </Button>
  </div>
      ) : (
        <div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Nombre del Medicamento</th>
                <th>Cantidad (mg)</th>
                <th>Intervalo (horas)</th>
                <th>Frecuencia (días)</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {medicamentos.map(medicamento => {
                if (
                  medicamento.nombre_medicamento &&
                  medicamento.cantidad_mg !== null &&
                  medicamento.intervalo_horas !== null &&
                  medicamento.cada_cuanto_dias !== null
                ) {
                  return (
                    <tr key={medicamento.dosis_id}>
                      <td>{medicamento.nombre_medicamento}</td>
                      <td>{medicamento.cantidad_mg}</td>
                      <td>{medicamento.intervalo_horas}</td>
                      <td>{medicamento.cada_cuanto_dias}</td>
                      <td>
                        <Button variant="info" onClick={() => handleEditMedicamento(medicamento)}>
                          Editar
                        </Button>{' '}
                        <Button variant="danger" onClick={() => handleDeleteMedicamento(medicamento)}>
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  );
                }
                return null;
              })}
            </tbody>
          </Table>
  
          <Button variant="success" onClick={handleAddMedicamento}>
            Agregar Medicamento
          </Button>
        </div>
      )}

      {/* Modal para agregar medicamento */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Medicamento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormularioDeMedicamento onSave={handleSaveMedicamento} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para editar medicamento */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Medicamento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Aquí puedes incluir un formulario para editar el medicamento */}
          {/* Puedes utilizar el estado selectedMedicamento para prellenar el formulario */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cerrar
          </Button>
          <Button variant="primary" /* Lógica para guardar cambios */>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default PerfilDeUsuario;
