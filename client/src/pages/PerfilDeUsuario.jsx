import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Table, Modal } from 'react-bootstrap';
import { useAuth } from '../context/AuthProvider';
import FormularioDeMedicamento from './FormularioDeMedicamento';
import 'animate.css';
import '../assets/css/PerfilDeUsuario.css';

function PerfilDeUsuario() {
  const { user, token, fetchMedicamentos, deleteMedicamento } = useAuth();
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMedicamento, setSelectedMedicamento] = useState(null);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    if (!user || !user.id) {
      navigate('/login');
      return;
    }

    try {
      const data = await fetchMedicamentos(user.id, token);
      setMedicamentos(data);
    } catch (error) {
      console.error('Error al obtener medicamentos:', error);
    } finally {
      setLoading(false);
    }
  }, [user, token, fetchMedicamentos, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddMedicamento = () => setShowAddModal(true);

  const handleEditMedicamento = (medicamento) => {
    setSelectedMedicamento(medicamento);
    setShowEditModal(true);
  };

  const handleDeleteMedicamento = async (medicamento) => {
    const confirmDelete = window.confirm('¿Estás seguro de eliminar este medicamento?');
    if (!confirmDelete) return;

    try {
      await deleteMedicamento(medicamento.dosis_id);
      setMedicamentos((prev) => prev.filter((m) => m.dosis_id !== medicamento.dosis_id));
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('No se pudo eliminar el medicamento. Intenta de nuevo.');
    }
  };

  const handleSaveMedicamento = (medicamento) => {
    setMedicamentos([...medicamentos, medicamento]);
    setShowAddModal(false);
  };

  if (loading) return <p className="text-center mt-5">Cargando...</p>;

  return (
    <Container className="perfil-container animate__animated animate__fadeIn mb-5">
      <h1>Perfil de Usuario</h1>
      {user && <p className="text-muted">Bienvenido, {user.nombre}</p>}
      <h2>Medicamentos</h2>

      {medicamentos.length === 0 ? (
        <div className="text-center">
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
              {medicamentos.map((medicamento) => (
                <tr key={medicamento.dosis_id}>
                  <td>{medicamento.nombre_medicamento}</td>
                  <td>{medicamento.cantidad_mg}</td>
                  <td>{medicamento.intervalo_horas}</td>
                  <td>{medicamento.cada_cuanto_dias}</td>
                  <td>
                    <Button variant="info" size="sm" onClick={() => handleEditMedicamento(medicamento)}>
                      Editar
                    </Button>{' '}
                    <Button variant="danger" size="sm" onClick={() => handleDeleteMedicamento(medicamento)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button variant="success" onClick={handleAddMedicamento}>
            Agregar Medicamento
          </Button>
        </div>
      )}

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

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Medicamento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMedicamento && (
            <p>Edición de <strong>{selectedMedicamento.nombre_medicamento}</strong> — próximamente.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default PerfilDeUsuario;
