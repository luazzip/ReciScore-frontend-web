import { useFetch } from '../../hooks/useFetch';
import { desafioService } from '../../services/desafioService';
import DesafioCard from './DesafioCard';
import Skeleton from '../common/Skeleton';
import EmptyState from '../common/EmptyState';
import ErrorMessage from '../common/ErrorMessage';

export default function DesafiosList() {
  const { data, isLoading, error, refetch } = useFetch((signal) => desafioService.getActivos(signal), []);

  if (isLoading) return <Skeleton rows={3} />;
  if (error) return <ErrorMessage error={error} onRetry={refetch} />;
  if (!data || data.length === 0) {
    return <EmptyState title="No hay desafíos activos" description="Vuelve más tarde para encontrar nuevos desafíos." />;
  }

  return (
    <div className="desafios-list">
      {data.map((d) => (
        <DesafioCard key={d.id} usuarioDesafio={{ desafio: d, progresoActual: 0, completado: false }} />
      ))}
    </div>
  );
}
