import React from "react";
import { Container, Button } from "react-bootstrap";
import "animate.css";
import midosisLogo from "../assets/img/midosis-logo.png";
import { Link } from "react-router-dom"; // Importa Link de react-router-dom
import { FaSignInAlt, FaUserPlus, FaQuestionCircle } from "react-icons/fa";

function Home() {
  return (
    <Container className="animate__animated animate__fadeIn text-center">
      <img
        src={midosisLogo}
        alt="MiDosis Logo"
        style={{ maxWidth: "60%", height: "auto" }} // Inline CSS for the logo
      />
      <div className="mb-5">
        <h1>Organiza tu salud</h1>
      </div>
      <div className="container text-center">
        <div className="row">
          <div className="col-4 mb-3">
            {/* Enlace para Iniciar Sesión */}
            <Link to="/perfil-usuario" className="btn btn-primary d-flex flex-column align-items-center">
              <FaSignInAlt size={30} />
              <span>Iniciar Sesión</span>
            </Link>
          </div>
          <div className="col-4 mb-3">
            {/* Enlace para Registrarse */}
            <Link to="/registro-nuevo-usuario" className="btn btn-info d-flex flex-column align-items-center">
              <FaUserPlus size={30} />
              <span>Registrarse</span>
            </Link>
          </div>
          <div className="col-4 mb-5">
            {/* Enlace de Ayuda */}
            <Link to="/ayuda" className="btn btn-success d-flex flex-column align-items-center">
              <FaQuestionCircle size={30} />
              <span>Ayuda</span>
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default Home;
