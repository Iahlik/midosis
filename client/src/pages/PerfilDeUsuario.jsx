import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Table, Button, Modal } from 'react-bootstrap';
import { useAuth } from '../context/AuthProvider';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import FormularioDeMedicamento from './FormularioDeMedicamento';
import 'animate.css';
import '../assets/css/PerfilDeUsuario.css';

function PerfilDeUsuario() {
  const { user } = useAuth();
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMedicamento, setSelectedMedicamento] = useState(null);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      if (!user) return;

      const q = query(collection(db, 'medicamentos'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);

      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMedicamentos(items);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener medicamentos:', error);
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, fetchData]);

  const handleAddMedicamento = () => setShowAddModal(true);

  const handleEditMedicamento = (medicamento) => {
    setSelectedMedicamento(medicamento);
    setShowEditModal(true);
  };

  const handleDeleteMedicamento = async (medicamento) => {
    const confirmDelete = window.confirm('¿Estás seguro de eliminar este medicamento?');
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, 'medicamentos', medicamento.id));
        setMedicamentos(medicamentos.filter((m) => m.id !== medicamento.id));
      } catch (error) {
        console.error('Error al eliminar medicamento:', error);
      }
    }
  };

  const handleSaveMedicamento = async (medicamento) => {
    try {
      if (medicamento.id) {
        // Es una edición
        const medRef = doc(db, 'medicamentos', medicamento.id);
        await updateDoc(medRef, {
          nombre: medicamento.nombre,
          cantidadMg: medicamento.cantidadMg,
          intervaloHoras: medicamento.intervaloHoras,
          frecuenciaDias: medicamento.frecuenciaDias,
        });
        setMedicamentos(medicamentos.map((m) =>
          m.id === medicamento.id ? { ...m, ...medicamento } : m
        ));
        setShowEditModal(false);
        setSelectedMedicamento(null);
      } else {
        // Es nuevo
        const docRef = await addDoc(collection(db, 'medicamentos'), {
          ...medicamento,
          userId: user.uid,
          createdAt: new Date()
        });
        setMedicamentos([...medicamentos, { ...medicamento, id: docRef.id }]);
        setShowAddModal(false);
      }
    } catch (error) {
      console.error('Error al guardar medicamento:', error);
    }
  };

  return (
    <Container className="perfil-container animate__animated animate__fadeIn mb-5">
      <h1>Perfil de Usuario</h1>
      <h2>Bienvenido, {user?.displayName || 'Usuario'}</h2>
      <h2>Medicamentos</h2>

      {loading ? (
        <p>Cargando...</p>
      ) : medicamentos.length === 0 ? (
        <div className="text-center">
          <p>No has registrado ningún medicamento.</p>
          <Button variant="success" onClick={handleAddMedicamento}>Agregar Medicamento</Button>
        </div>
      ) : (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Cantidad (mg)</th>
                <th>Intervalo (horas)</th>
                <th>Frecuencia (días)</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {medicamentos.map((medicamento) => (
                <tr key={medicamento.id}>
                  <td>{medicamento.nombre}</td>
                  <td>{medicamento.cantidadMg}</td>
                  <td>{medicamento.intervaloHoras}</td>
                  <td>{medicamento.frecuenciaDias}</td>
                  <td>
                    <Button variant="info" onClick={() => handleEditMedicamento(medicamento)}>Editar</Button>{' '}
                    <Button variant="danger" onClick={() => handleDeleteMedicamento(medicamento)}>Eliminar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button variant="success" onClick={handleAddMedicamento}>Agregar Medicamento</Button>
        </>
      )}

      {/* Modal para agregar */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Medicamento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormularioDeMedicamento onSave={handleSaveMedicamento} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cerrar</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para editar */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Medicamento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormularioDeMedicamento
            onSave={handleSaveMedicamento}
            initialData={selectedMedicamento}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default PerfilDeUsuario;
