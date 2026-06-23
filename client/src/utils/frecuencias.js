export const FRECUENCIAS = [
  { valor: '24', label: 'Una vez al día' },
  { valor: '12', label: 'Dos veces al día' },
  { valor: '8',  label: 'Tres veces al día' },
  { valor: '6',  label: 'Cuatro veces al día' },
  { valor: '4',  label: 'Cada 4 horas' },
  { valor: '48', label: 'Día por medio' },
  { valor: '72', label: 'Cada 3 días' },
  { valor: 'personalizado', label: 'Personalizado...' },
];

export const DURACIONES = [
  { valor: 'indefinido',    label: 'Indefinido / crónico' },
  { valor: '3',             label: '3 días' },
  { valor: '5',             label: '5 días' },
  { valor: '7',             label: '1 semana' },
  { valor: '10',            label: '10 días' },
  { valor: '14',            label: '2 semanas' },
  { valor: '30',            label: '1 mes' },
  { valor: '90',            label: '3 meses' },
  { valor: 'personalizado', label: 'Personalizado...' },
];

export function labelFrecuencia(horas) {
  if (!horas) return '—';
  const match = FRECUENCIAS.find((f) => f.valor === String(horas));
  return match && match.valor !== 'personalizado' ? match.label : `Cada ${horas}h`;
}

export function labelDuracion(dias) {
  if (dias === null || dias === undefined) return 'Crónico';
  const match = DURACIONES.find((d) => d.valor === String(dias));
  return match && match.valor !== 'personalizado' ? match.label : `${dias} días`;
}

export function detectarFrecuencia(horas) {
  const match = FRECUENCIAS.find((f) => f.valor === String(horas));
  return match ? match.valor : 'personalizado';
}

export function detectarDuracion(dias) {
  if (dias === null || dias === undefined) return 'indefinido';
  const match = DURACIONES.find((d) => d.valor === String(dias));
  return match ? match.valor : 'personalizado';
}

export function calcularHorasDosis(horaInicio, intervaloHoras) {
  if (!horaInicio || !intervaloHoras) return [];
  const horas = parseInt(intervaloHoras);
  if (isNaN(horas) || horas <= 0 || horas > 24) return [];
  const [h, m] = horaInicio.split(':').map(Number);
  const cantidad = Math.round(24 / horas);
  return Array.from({ length: cantidad }, (_, i) => {
    const totalMin = (h * 60 + m + horas * 60 * i) % (24 * 60);
    const hh = Math.floor(totalMin / 60).toString().padStart(2, '0');
    const mm = (totalMin % 60).toString().padStart(2, '0');
    return `${hh}:${mm}`;
  });
}
