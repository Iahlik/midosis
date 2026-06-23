import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AjustesDeAlarma, Ayuda, Configuracion, FormularioDeMedicamento, Home, ListaDeMedicamentos, PerfilDeUsuario, RegistroNuevoUsuario, Login, RecuperarContrasena, RestablecerContrasena } from './pages/index';
import { NavBar, Footer } from './components/index';
import { AuthProvider } from './context/AuthProvider'; // Importa el AuthProvider
import { ToastContainer } from 'react-toastify'; // Importa el ToastContainer y sus estilos
import 'react-toastify/dist/ReactToastify.css'; // Añade los estilos de react-toastify

function App() {
  return (
    <Router>
       <AuthProvider>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <div style={{ flex: 1, marginBottom: '9vh' }}>
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/registro-medicamento" element={<FormularioDeMedicamento />} />
            <Route path="/lista-medicamentos" element={<ListaDeMedicamentos />} />
            <Route path="/ajustes-alarma" element={<AjustesDeAlarma />} />
            <Route path="/configuracion" element={<Configuracion />} />
            <Route path="/perfil-usuario" element={<PerfilDeUsuario />} />
            <Route path="/registro-nuevo-usuario" element={<RegistroNuevoUsuario />} />
            <Route path="/ayuda" element={<Ayuda />} />
            <Route path="/login" element={<Login />} />
            <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
            <Route path="/restablecer-contrasena" element={<RestablecerContrasena />} />
          </Routes>
        </div>
        <Footer />
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
      </AuthProvider>
    </Router>
  );
}

export default App;
