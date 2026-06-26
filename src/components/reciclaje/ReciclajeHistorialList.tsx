import { useFetch } from '../../hooks/useFetch';
import { reciclajeService } from '../../services/reciclajeService';
import { useAuth } from '../../hooks/useAuth';
import ReciclajeCard from './ReciclajeCard';
import Skeleton from '../common/Skeleton';
import EmptyState from '../common/EmptyState';
import ErrorMessage from '../common/ErrorMessage';

export default function ReciclajeHistorialList() {
  const { usuario } = useAuth();

  const { data, isLoading, error, refetch } = useFetch(
    (signal) => reciclajeService.getHistorial(usuario!.id, { page: 0, size: 10 }, signal),
    [usuario?.id]
  );

  if (isLoading) return <Skeleton rows={4} />;
  if (error) return <ErrorMessage error={error} onRetry={refetch} />;
  if (!data || data.length === 0) {
    return <EmptyState title="Aún no tienes reciclajes registrados" description="Registra tu primer reciclaje para empezar a sumar puntos." />;
  }

  return (
    <div>
      <div className="reciclaje-list">
        {data.map((r) => (
          <ReciclajeCard key={r.numeroReporte} reporte={r} />
        ))}
      </div>
    </div>
  );
}
