import type { Desafio } from '../../types/desafio.types';
import type { ApiError } from '../../types/api.types';
import DesafioCard from './DesafioCard';
import Skeleton from '../common/Skeleton';
import EmptyState from '../common/EmptyState';
import ErrorMessage from '../common/ErrorMessage';

interface DesafiosListViewProps {
  desafios: Desafio[];
  inscritos: Set<number>;
  isLoading: boolean;
  error: ApiError | null;
  onRetry: () => void;
  onInscribirse: (desafioId: number) => Promise<void>;
  onDesistir: (desafioId: number) => Promise<void>;
}

export default function DesafiosListView({ desafios, inscritos, isLoading, error, onRetry, onInscribirse, onDesistir }: DesafiosListViewProps) {
  if (isLoading) return <Skeleton rows={3} />;
  if (error) return <ErrorMessage error={error} onRetry={onRetry} />;
  if (desafios.length === 0) {
    return <EmptyState title="No hay desafíos activos" description="Vuelve más tarde para encontrar nuevos desafíos." />;
  }

  return (
    <div className="desafios-list">
      {desafios.map((d) => (
        <DesafioCard
          key={d.id}
          usuarioDesafio={{ desafio: d, progresoActual: d.progresoActual ?? 0, completado: d.completado ?? false }}
          inscrito={inscritos.has(d.id)}
          onInscribirse={onInscribirse}
          onDesistir={onDesistir}
        />
      ))}
    </div>
  );
}
