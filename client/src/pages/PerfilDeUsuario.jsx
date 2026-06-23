import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Table, Modal, Row, Col, Card, Badge } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPills, FaClock, FaBell, FaPlus } from 'react-icons/fa';
import { useAuth } from '../context/AuthProvider';
import FormularioDeMedicamento from './FormularioDeMedicamento';
import FormularioEdicionMedicamento from './FormularioEdicionMedicamento';
import { labelFrecuencia, labelDuracion } from '../utils/frecuencias';
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
    if (!user?.id) { navigate('/login'); return; }
    try {
      const data = await fetchMedicamentos(user.id, token);
      setMedicamentos(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user, token, fetchMedicamentos, navigate]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const proximaDosis = useMemo(() => {
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const futuras = medicamentos
      .filter(m => m.hora_inicio)
      .map(m => ({
        hora: m.hora_inicio.slice(0, 5),
        min: parseInt(m.hora_inicio.slice(0, 2)) * 60 + parseInt(m.hora_inicio.slice(3, 5)),
        nombre: m.nombre_medicamento,
      }))
      .filter(m => m.min > nowMin)
      .sort((a, b) => a.min - b.min);
    return futuras[0] || null;
  }, [medicamentos]);

  const handleAddMedicamento = () => setShowAddModal(true);
  const handleEditMedicamento = (med) => { setSelectedMedicamento(med); setShowEditModal(true); };
  const handleDeleteClick = (med) => { setMedicamentoAEliminar(med); setShowDeleteModal(true); };

  const handleConfirmDelete = async () => {
    if (!medicamentoAEliminar) return;
    setDeletingId(medicamentoAEliminar.dosis_id);
    try {
      await deleteMedicamento(medicamentoAEliminar.dosis_id);
      setMedicamentos(prev => prev.filter(m => m.dosis_id !== medicamentoAEliminar.dosis_id));
    } catch (err) {
      console.error(err);
    } finally {
      setShowDeleteModal(false);
      setMedicamentoAEliminar(null);
      setDeletingId(null);
    }
  };

  const handleSaveMedicamento = (meds) => { setMedicamentos(meds); setShowAddModal(false); };
  const handleUpdateMedicamento = (updated) => {
    setMedicamentos(prev => prev.map(m => m.dosis_id === updated.dosis_id ? updated : m));
    setShowEditModal(false);
    setSelectedMedicamento(null);
  };

  if (loading) return <p className="text-center mt-5 text-muted">Cargando...</p>;

  return (
    <Container className="perfil-container animate__animated animate__fadeIn mb-5">
      <h1 className="mb-1">Perfil</h1>
      {user && <p className="text-muted mb-4">Bienvenido, <strong>{user.nombre}</strong></p>}

      {/* Stats */}
      {medicamentos.length > 0 && (
        <Row className="g-3 mb-4">
          <Col xs={6} md={3}>
            <Card className="stat-card text-center">
              <Card.Body>
                <div className="stat-number">{medicamentos.length}</div>
                <div className="stat-label"><FaPills className="me-1" />Medicamentos</div>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={6} md={3}>
            <Card className="stat-card text-center">
              <Card.Body>
                <div className="stat-number">{proximaDosis ? proximaDosis.hora : '—'}</div>
                <div className="stat-label"><FaClock className="me-1" />Próxima dosis</div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="section-title mb-0">Medicamentos</h2>
        <Button variant="primary" size="sm" onClick={handleAddMedicamento} className="d-flex align-items-center gap-1">
          <FaPlus size={12} /> Agregar
        </Button>
      </div>

      {medicamentos.length === 0 ? (
        <Card className="text-center p-4">
          <FaPills size={40} className="text-muted mb-3 mx-auto d-block" />
          <p className="text-muted mb-3">No has registrado ningún medicamento.</p>
          <Button variant="primary" onClick={handleAddMedicamento} className="mx-auto">
            <FaPlus className="me-1" /> Agregar medicamento
          </Button>
        </Card>
      ) : (
        <>
          {/* ── Mobile: cards ── */}
          <div className="d-md-none">
            {medicamentos.map(med => (
              <Card key={med.dosis_id} className="mb-2 med-card">
                <Card.Body className="py-2 px-3">
                  <div className="d-flex justify-content-between align-items-start">
                    <div style={{ minWidth: 0 }}>
                      <div className="med-nombre">{med.nombre_medicamento}</div>
                      <div className="med-detalle">
                        {med.cantidad_mg} mg · {labelFrecuencia(med.intervalo_horas)}
                        {med.hora_inicio && <> · <FaClock size={10} className="me-1" />{med.hora_inicio.slice(0, 5)}</>}
                      </div>
                      {med.notas && <div className="fst-italic text-muted" style={{ fontSize: '0.78rem' }}>{med.notas}</div>}
                    </div>
                    <div className="d-flex gap-1 ms-2 flex-shrink-0">
                      <Button variant="outline-info" size="sm" onClick={() => handleEditMedicamento(med)} style={{ padding: '0.2rem 0.5rem' }}>
                        <FaEdit />
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDeleteClick(med)} style={{ padding: '0.2rem 0.5rem' }}>
                        <FaTrash />
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>

          {/* ── Desktop: table ── */}
          <div className="d-none d-md-block">
            <Table striped hover responsive className="med-table">
              <thead>
                <tr>
                  <th>Medicamento</th>
                  <th>mg</th>
                  <th>Frecuencia</th>
                  <th>Duración</th>
                  <th>Hora</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {medicamentos.map(med => (
                  <tr key={med.dosis_id}>
                    <td>
                      {med.nombre_medicamento}
                      {med.notas && <div className="text-muted small fst-italic">{med.notas}</div>}
                    </td>
                    <td>{med.cantidad_mg}</td>
                    <td>{labelFrecuencia(med.intervalo_horas)}</td>
                    <td>{labelDuracion(med.cada_cuanto_dias)}</td>
                    <td>{med.hora_inicio ? med.hora_inicio.slice(0, 5) : <span className="text-muted">—</span>}</td>
                    <td>
                      <Button variant="outline-info" size="sm" className="me-1" onClick={() => handleEditMedicamento(med)}>
                        <FaEdit className="me-1" />Editar
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDeleteClick(med)}>
                        <FaTrash className="me-1" />Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </>
      )}

      {/* Modal agregar */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton><Modal.Title>Agregar Medicamento</Modal.Title></Modal.Header>
        <Modal.Body><FormularioDeMedicamento onSave={handleSaveMedicamento} /></Modal.Body>
      </Modal>

      {/* Modal editar */}
      <Modal show={showEditModal} onHide={() => { setShowEditModal(false); setSelectedMedicamento(null); }}>
        <Modal.Header closeButton><Modal.Title>Editar Medicamento</Modal.Title></Modal.Header>
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
        <Modal.Header closeButton><Modal.Title>Confirmar eliminación</Modal.Title></Modal.Header>
        <Modal.Body>
          {medicamentoAEliminar && (
            <p>¿Eliminar <strong>{medicamentoAEliminar.nombre_medicamento}</strong>? Esta acción no se puede deshacer.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
          <Button variant="danger" onClick={handleConfirmDelete} disabled={!!deletingId}>
            {deletingId ? 'Eliminando...' : <><FaTrash className="me-1" />Eliminar</>}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default PerfilDeUsuario;
