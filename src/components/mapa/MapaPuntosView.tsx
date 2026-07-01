import type { PuntoMapa } from '../../types/puntoMapa.types';
import type { ApiError } from '../../types/api.types';
import Skeleton from '../common/Skeleton';
import ErrorMessage from '../common/ErrorMessage';
import EmptyState from '../common/EmptyState';
import PuntoMapaCard from './PuntoMapaCard';

interface MapaPuntosViewProps {
  puntos: PuntoMapa[];
  isLoading: boolean;
  error: ApiError | null;
  onRetry: () => void;
}

export default function MapaPuntosView({ puntos, isLoading, error, onRetry }: MapaPuntosViewProps) {
  if (isLoading) return <Skeleton rows={5} />;
  if (error) return <ErrorMessage error={error} onRetry={onRetry} />;
  if (puntos.length === 0) {
    return <EmptyState title="No hay puntos de acopio registrados" description="Vuelve más tarde para ver los puntos disponibles." />;
  }

  return (
    <div className="mapa-puntos-list">
      {puntos.map((punto) => <PuntoMapaCard key={punto.id} punto={punto} />)}
    </div>
  );
}
