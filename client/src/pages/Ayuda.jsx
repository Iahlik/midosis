import React from "react";
import { Container, Card, Button } from "react-bootstrap";
import "animate.css";

function Ayuda() {
  return (
    <Container className="animate__animated animate__fadeIn mt-5 mb-5">
      <div className="containter text-center">
        {" "}
        <h1>Preguntas Frecuentes</h1>
      </div>
      <div className="container text-center mt-5">
      <Card>
  <Card.Header className="bg-primary text-white">
    ¿Cómo cambio la hora de recordatorio de un medicamento?
  </Card.Header>
  <Card.Body>
    Para cambiar la hora de recordatorio de un medicamento, sigue estos pasos:
    1. Ve a la página "Lista de Medicamentos".
    2. Encuentra el medicamento que deseas editar y haz clic en él.
    3. Dentro de la página de detalles, busca la opción de editar la hora de recordatorio y realiza el cambio.
    4. Presiona "Guardar" para actualizar la hora del recordatorio.
  </Card.Body>
</Card>

<Card>
  <Card.Header className="bg-primary text-white">
    ¿Cómo elimino un recordatorio de alarma?
  </Card.Header>
  <Card.Body>
    Si deseas eliminar un recordatorio de alarma, sigue estos pasos:
    1. Ve a la página "Ajustes de Alarma".
    2. Encuentra el recordatorio que deseas eliminar y haz clic en él.
    3. Busca una opción para eliminar o desactivar la alarma y confirma la acción.
    4. La alarma se eliminará de tu configuración.
  </Card.Body>
</Card>

<Card>
  <Card.Header className="bg-primary text-white">
    ¿Puedo exportar mi lista de medicamentos o historial?
  </Card.Header>
  <Card.Body>
    Sí, puedes exportar tu lista de medicamentos o tu historial. Ve a la página correspondiente (Lista de Medicamentos o Historial) y busca una opción para exportar. Puedes guardar los datos en un archivo que luego podrás importar si es necesario.
  </Card.Body>
</Card>

<Card>
  <Card.Header className="bg-primary text-white">
    ¿Qué debo hacer si olvidé tomar un medicamento?
  </Card.Header>
  <Card.Body>
    Si olvidaste tomar un medicamento, no te preocupes. Sigue tu programa normal y toma el medicamento en cuanto te des cuenta, a menos que sea casi hora de la siguiente toma. En ese caso, omite la dosis olvidada y continúa según lo programado.
  </Card.Body>
</Card>


      </div>
      {/* Agrega más preguntas y respuestas según sea necesario */}



     <div className="container text-center mt-5">
     <Button variant="primary" href="/contacto">
        Contáctanos
      </Button>
      {/* Agrega un enlace para contactar al soporte o equipo de ayuda */}
      </div>

    </Container>
  );
}

export default Ayuda;
