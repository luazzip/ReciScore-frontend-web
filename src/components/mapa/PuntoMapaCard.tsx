import type { PuntoMapa } from '../../types/puntoMapa.types';

interface PuntoMapaCardProps {
  punto: PuntoMapa;
}

export default function PuntoMapaCard({ punto }: PuntoMapaCardProps) {
  return (
    <div className="punto-mapa-card">
      <strong>{punto.nombre}</strong>
      <span className={punto.tipo === 'ACOPIO_OFICIAL' ? 'badge-ok' : 'badge-warning'}>
        {punto.tipo === 'ACOPIO_OFICIAL' ? 'Punto de acopio' : 'Zona sucia reportada'}
      </span>
    </div>
  );
}
