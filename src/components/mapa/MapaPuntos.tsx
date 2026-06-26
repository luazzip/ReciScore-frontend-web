import { useFetch } from '../../hooks/useFetch';
import { mapaService } from '../../services/mapaService';
import Skeleton from '../common/Skeleton';
import ErrorMessage from '../common/ErrorMessage';
import EmptyState from '../common/EmptyState';
import PuntoMapaCard from './PuntoMapaCard';

export default function MapaPuntos() {
  const { data, isLoading, error, refetch } = useFetch((signal) => mapaService.getPuntos(signal), []);

  if (isLoading) return <Skeleton rows={5} />;
  if (error) return <ErrorMessage error={error} onRetry={refetch} />;
  if (!data || data.length === 0) {
    return <EmptyState title="No hay puntos de acopio registrados" description="Vuelve más tarde para ver los puntos disponibles." />;
  }

  return (
    <div className="mapa-puntos-list">
      {data.map((punto) => <PuntoMapaCard key={punto.id} punto={punto} />)}
    </div>
  );
}
