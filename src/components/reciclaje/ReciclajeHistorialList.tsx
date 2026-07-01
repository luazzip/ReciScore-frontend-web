import { useFetch } from '../../hooks/useFetch';
import { reciclajeService } from '../../services/reciclajeService';
import { useAuth } from '../../hooks/useAuth';
import ReciclajeHistorialListView from './ReciclajeHistorialListView';
import type { ReporteReciclaje } from '../../types/reciclaje.types';

export default function ReciclajeHistorialList() {
  const { usuario } = useAuth();

  const { data, isLoading, error, refetch } = useFetch(
    (signal) => reciclajeService.getHistorial(usuario!.id, { page: 0, size: 10 }, signal),
    [usuario?.id]
  );

  const reportes: ReporteReciclaje[] = data ?? [];

  return (
    <ReciclajeHistorialListView
      reportes={reportes}
      isLoading={isLoading}
      error={error}
      onRetry={refetch}
    />
  );
}
