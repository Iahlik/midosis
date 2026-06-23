import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Table, Modal } from 'react-bootstrap';
import { useAuth } from '../context/AuthProvider';
import FormularioDeMedicamento from './FormularioDeMedicamento';
import FormularioEdicionMedicamento from './FormularioEdicionMedicamento';
import 'animate.css';
import '../assets/css/PerfilDeUsuario.css';

function PerfilDeUsuario() {
  const { user, token, fetchMedicamentos, deleteMedicamento } = useAuth();
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMedicamento, setSelectedMedicamento] = useState(null);
  const [medicamentoAEliminar, setMedicamentoAEliminar] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
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

  const handleDeleteClick = (medicamento) => {
    setMedicamentoAEliminar(medicamento);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!medicamentoAEliminar) return;
    setDeletingId(medicamentoAEliminar.dosis_id);
    try {
      await deleteMedicamento(medicamentoAEliminar.dosis_id);
      setMedicamentos((prev) => prev.filter((m) => m.dosis_id !== medicamentoAEliminar.dosis_id));
    } catch (error) {
      console.error('Error al eliminar:', error);
    } finally {
      setShowDeleteModal(false);
      setMedicamentoAEliminar(null);
      setDeletingId(null);
    }
  };

  const handleSaveMedicamento = (medicamento) => {
    setMedicamentos((prev) => [...prev, medicamento]);
    setShowAddModal(false);
  };

  const handleUpdateMedicamento = (updated) => {
    setMedicamentos((prev) =>
      prev.map((m) => (m.dosis_id === updated.dosis_id ? updated : m))
    );
    setShowEditModal(false);
    setSelectedMedicamento(null);
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
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Medicamento</th>
                <th>Cantidad (mg)</th>
                <th>Intervalo (h)</th>
                <th>Días</th>
                <th>Hora</th>
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
                    {medicamento.hora_inicio
                      ? medicamento.hora_inicio.slice(0, 5)
                      : <span className="text-muted">—</span>}
                  </td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleEditMedicamento(medicamento)}
                    >
                      Editar
                    </Button>{' '}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteClick(medicamento)}
                    >
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

      {/* Modal agregar */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Medicamento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormularioDeMedicamento onSave={handleSaveMedicamento} />
        </Modal.Body>
      </Modal>

      {/* Modal editar */}
      <Modal show={showEditModal} onHide={() => { setShowEditModal(false); setSelectedMedicamento(null); }}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Medicamento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMedicamento && (
            <FormularioEdicionMedicamento
              medicamento={selectedMedicamento}
              onSave={handleUpdateMedicamento}
              onCancel={() => { setShowEditModal(false); setSelectedMedicamento(null); }}
            />
          )}
        </Modal.Body>
      </Modal>

      {/* Modal confirmar eliminación */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {medicamentoAEliminar && (
            <p>
              ¿Estás seguro de que quieres eliminar{' '}
              <strong>{medicamentoAEliminar.nombre_medicamento}</strong>?
              Esta acción no se puede deshacer.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirmDelete}
            disabled={!!deletingId}
          >
            {deletingId ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default PerfilDeUsuario;
