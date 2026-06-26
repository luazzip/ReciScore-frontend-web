import type { ReporteReciclaje } from '../../types/reciclaje.types';
import { formatFecha } from '../../utils/formatters';

interface ReciclajeCardProps {
  reporte: ReporteReciclaje;
}

export default function ReciclajeCard({ reporte }: ReciclajeCardProps) {
  return (
    <article className="reciclaje-card">
      <header>
        <h4>{reporte.materialNombre}</h4>
        <span>{formatFecha(reporte.fecha)}</span>
      </header>
      <p>{reporte.numeroArticulos} artículo(s) · {reporte.tamanoObjeto.toLowerCase()}</p>
      <div className="badges-row">
        <span className={reporte.validadoIa ? 'badge-ok' : 'badge-pending'}>
          {reporte.validadoIa ? 'Validado por IA' : 'Pendiente IA'}
        </span>
        <span className={reporte.gpsValidado ? 'badge-ok' : 'badge-pending'}>
          {reporte.gpsValidado ? 'GPS verificado' : 'GPS no verificado'}
        </span>
      </div>
    </article>
  );
}
