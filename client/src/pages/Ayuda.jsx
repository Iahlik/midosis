import React, { useState } from 'react';
import { Container, Accordion } from 'react-bootstrap';
import 'animate.css';

const faqs = [
  {
    q: '¿Cómo agrego un medicamento?',
    a: 'Ve a tu Perfil de Usuario y haz clic en "Agregar Medicamento". Selecciona el medicamento del listado o escríbelo manualmente, ingresa la dosis en mg, la frecuencia (cuántas veces al día), la duración del tratamiento y la hora de inicio. Guarda y aparecerá en tu tabla de medicamentos.',
  },
  {
    q: '¿Cómo edito un medicamento existente?',
    a: 'En tu Perfil de Usuario, en la tabla de medicamentos, haz clic en "Editar" en la fila del medicamento que quieres modificar. Cambia los datos que necesites y guarda.',
  },
  {
    q: '¿Cómo elimino un medicamento?',
    a: 'En tu Perfil de Usuario, haz clic en "Eliminar" en la fila correspondiente. Aparecerá un cuadro de confirmación — haz clic en "Eliminar" para confirmar. Esta acción no se puede deshacer.',
  },
  {
    q: '¿Cómo activo las notificaciones de recordatorio?',
    a: 'Ve a la página "Alarmas" desde el menú. Ahí verás todos tus medicamentos con su horario calculado. Si el medicamento tiene una hora de inicio configurada, los horarios se muestran automáticamente. Haz clic en "Activar recordatorios" para programar las notificaciones en tu teléfono. Debes dar permiso de notificaciones cuando el sistema lo solicite.',
  },
  {
    q: '¿Las alarmas sobreviven al reinicio del teléfono?',
    a: 'Sí, la aplicación está configurada para restaurar las notificaciones automáticamente cuando el teléfono se reinicia. Sin embargo, en teléfonos Xiaomi/MIUI debes activar "Inicio Automático" para MiDosis en Ajustes → Aplicaciones → MiDosis → Inicio automático. Sin esto, MIUI puede cancelar las alarmas al reiniciar.',
  },
  {
    q: '¿Qué significa "Indefinido / crónico" en la duración?',
    a: 'Significa que el medicamento se toma de forma continua sin fecha de término (por ejemplo, medicamentos para enfermedades crónicas). No se registra una cantidad de días de tratamiento.',
  },
  {
    q: '¿Qué pasa si no configuro una hora de inicio para un medicamento?',
    a: 'En la página de Alarmas podrás ingresar la hora directamente para ese medicamento. Sin embargo, esta hora solo se guarda localmente. Para que sea permanente, edita el medicamento en tu Perfil de Usuario y configura la hora de inicio ahí.',
  },
  {
    q: '¿Cómo cambio mi nombre o contraseña?',
    a: 'Ve a "Configuración" desde el menú. Ahí encontrarás opciones para cambiar tu nombre y tu contraseña. Para cambiar la contraseña necesitas ingresar tu contraseña actual primero.',
  },
  {
    q: '¿Olvidé mi contraseña, qué hago?',
    a: 'En la pantalla de inicio de sesión, haz clic en "¿Olvidaste tu contraseña?". Ingresa tu correo electrónico y recibirás un enlace para crear una nueva contraseña. El enlace es válido por 1 hora.',
  },
  {
    q: '¿Mis datos son privados?',
    a: 'Sí. Tus medicamentos y datos personales están asociados a tu cuenta y protegidos con contraseña. Solo tú puedes verlos cuando inicias sesión.',
  },
];

function Ayuda() {
  return (
    <Container className="animate__animated animate__fadeIn mt-4 mb-5" style={{ maxWidth: '720px' }}>
      <h1 className="mb-1">Ayuda</h1>
      <p className="text-muted mb-4">Preguntas frecuentes sobre cómo usar MiDosis.</p>

      <Accordion>
        {faqs.map((faq, i) => (
          <Accordion.Item eventKey={String(i)} key={i}>
            <Accordion.Header>{faq.q}</Accordion.Header>
            <Accordion.Body className="text-muted">{faq.a}</Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </Container>
  );
}

export default Ayuda;
