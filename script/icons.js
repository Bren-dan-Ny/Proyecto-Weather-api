export const obtenerRutaIcono = (codigo) => {
  if (codigo === 0) return "./assets/images/icon-sunny.webp";
  if (codigo === 1 || codigo === 2)
    return "./assets/images/icon-partly-cloudy.webp";
  if (codigo === 3) return "./assets/images/icon-overcast.webp";
  if (codigo >= 45 && codigo <= 48) return "./assets/images/icon-fog.webp";
  if (codigo >= 51 && codigo <= 57) return "./assets/images/icon-drizzle.webp";
  if ((codigo >= 61 && codigo <= 67) || (codigo >= 80 && codigo <= 82)) {
    return "./assets/images/icon-rain.webp";
  }
  if ((codigo >= 71 && codigo <= 77) || (codigo >= 85 && codigo <= 86)) {
    return "./assets/images/icon-snow.webp";
  }
  if (codigo >= 95 && codigo <= 99) return "./assets/images/icon-storm.webp";
  return "./assets/images/icon-sunny.webp";
};
