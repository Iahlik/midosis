export function calcularFortaleza(password) {
  let puntos = 0;
  if (password.length >= 8) puntos++;
  if (password.length >= 12) puntos++;
  if (/[A-Z]/.test(password)) puntos++;
  if (/[0-9]/.test(password)) puntos++;
  if (/[^A-Za-z0-9]/.test(password)) puntos++;
  return puntos;
}

export const nivelFortaleza = (puntos) => {
  if (puntos <= 1) return { label: 'Muy débil', variant: 'danger', valor: 20 };
  if (puntos === 2) return { label: 'Débil', variant: 'warning', valor: 40 };
  if (puntos === 3) return { label: 'Regular', variant: 'info', valor: 60 };
  if (puntos === 4) return { label: 'Fuerte', variant: 'primary', valor: 80 };
  return { label: 'Muy fuerte', variant: 'success', valor: 100 };
};
