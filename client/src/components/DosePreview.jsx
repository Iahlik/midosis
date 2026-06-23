import React from 'react';
import { calcularHorasDosis } from '../utils/frecuencias';

function DosePreview({ horaInicio, intervaloHoras }) {
  if (!horaInicio || !intervaloHoras) return null;

  const horas = parseInt(intervaloHoras);
  if (isNaN(horas) || horas <= 0) return null;

  if (horas > 24) {
    return (
      <div className="p-2 bg-light border rounded text-center small">
        <span className="text-muted">Primera dosis: </span>
        <strong>{horaInicio}</strong>
        <span className="text-muted"> · siguiente en {horas}h</span>
      </div>
    );
  }

  const dosis = calcularHorasDosis(horaInicio, horas);

  return (
    <div className="p-2 bg-light border rounded text-center small">
      <div className="text-muted mb-2">Tomarás tu medicamento a las:</div>
      <div className="d-flex flex-wrap gap-2 justify-content-center">
        {dosis.map((d, i) => (
          <span
            key={i}
            className="badge bg-primary"
            style={{ fontSize: '0.9rem', padding: '6px 12px' }}
          >
            {d}
          </span>
        ))}
      </div>
    </div>
  );
}

export default DosePreview;
