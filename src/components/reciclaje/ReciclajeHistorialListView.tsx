import type { ReporteReciclaje } from '../../types/reciclaje.types';
import type { ApiError } from '../../types/api.types';
import ReciclajeCard from './ReciclajeCard';
import Skeleton from '../common/Skeleton';
import EmptyState from '../common/EmptyState';
import ErrorMessage from '../common/ErrorMessage';

interface ReciclajeHistorialListViewProps {
  reportes: ReporteReciclaje[];
  isLoading: boolean;
  error: ApiError | null;
  onRetry: () => void;
}

export default function ReciclajeHistorialListView({ reportes, isLoading, error, onRetry }: ReciclajeHistorialListViewProps) {
  if (isLoading) return <Skeleton rows={4} />;
  if (error) return <ErrorMessage error={error} onRetry={onRetry} />;
  if (reportes.length === 0) {
    return <EmptyState title="Aún no tienes reciclajes registrados" description="Registra tu primer reciclaje para empezar a sumar puntos." />;
  }

  return (
    <div>
      <div className="reciclaje-list">
        {reportes.map((r) => (
          <ReciclajeCard key={r.numeroReporte} reporte={r} />
        ))}
      </div>
    </div>
  );
}
