import L from 'leaflet';

export function crearIcono(tipo: string, activo: boolean) {
  let color: string;
  let size: number;
  let iconSvg: string;

  if (tipo === 'ZONA_SUCIA') {
    color = activo ? '#dc2626' : '#f87171';
    size  = activo ? 44 : 36;
    iconSvg = `<path d="M12 7v4M12 14.5v.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
  } else {
    color = activo ? '#16a34a' : '#4ade80';
    size  = activo ? 44 : 36;
    iconSvg = `<path d="M9 10l1.5 1.5L15 8" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24">
      <circle cx="12" cy="10" r="9" fill="${color}" stroke="white" stroke-width="1.5"/>
      <path d="M12 21 C12 21 5 15 5 10 A7 7 0 0 1 19 10 C19 15 12 21 12 21Z"
            fill="${color}" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
      ${iconSvg}
    </svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize:   [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}

export function crearIconoReporte() {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
      <circle cx="12" cy="10" r="9" fill="#dc2626" stroke="white" stroke-width="1.5"/>
      <path d="M12 21 C12 21 5 15 5 10 A7 7 0 0 1 19 10 C19 15 12 21 12 21Z"
            fill="#dc2626" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
      <path d="M12 7v4M12 14.5v.5" stroke="white" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    </svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize:   [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
}

export function crearIconoUsuario() {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="#2563eb" stroke="white" stroke-width="2"/>
      <circle cx="12" cy="12" r="4" fill="white"/>
    </svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize:   [36, 36],
    iconAnchor: [18, 18],
  });
}
