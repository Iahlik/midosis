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
        style={{ maxWidth: "50%", height: "auto" }} // Inline CSS for the logo
      />
      <div className="mb-5">
        <h1>Organiza tu salud</h1>
      </div>
      <div className="container text-center">
        <div className="row">
          <div className="col-12 col-sm-4 mb-3">
            <Link to="/login" className="btn btn-primary w-100 d-flex flex-column align-items-center py-3">
              <FaSignInAlt size={30} />
              <span>Iniciar Sesión</span>
            </Link>
          </div>
          <div className="col-12 col-sm-4 mb-3">
            <Link to="/registro-nuevo-usuario" className="btn btn-info w-100 d-flex flex-column align-items-center py-3">
              <FaUserPlus size={30} />
              <span>Registrarse</span>
            </Link>
          </div>
          <div className="col-12 col-sm-4 mb-5">
            <Link to="/ayuda" className="btn btn-success w-100 d-flex flex-column align-items-center py-3">
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
