import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AjustesDeAlarma, Ayuda, Configuracion, FormularioDeMedicamento, Home, ListaDeMedicamentos, PerfilDeUsuario, RegistroNuevoUsuario } from './pages/index';
import { NavBar, Footer } from './components/index';

function App() {
  return (
    <Router>
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
            {/* Agrega más rutas según sea necesario */}
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
