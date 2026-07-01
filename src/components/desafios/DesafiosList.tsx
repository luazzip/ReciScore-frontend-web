import { useState, useEffect, useCallback } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { desafioService } from '../../services/desafioService';
import DesafioCard from './DesafioCard';
import Skeleton from '../common/Skeleton';
import EmptyState from '../common/EmptyState';
import ErrorMessage from '../common/ErrorMessage';

export default function DesafiosList() {
  const { usuario } = useAuth();
  const { notify } = useNotification();
  const { data, isLoading, error, refetch } = useFetch(
    (signal) => usuario ? desafioService.getActivosConInscripcion(usuario.id, signal) : desafioService.getActivos(signal),
    [usuario?.id]
  );
  const [inscritos, setInscritos] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (data) {
      setInscritos(new Set(data.filter((d) => d.inscrito).map((d) => d.id)));
    }
  }, [data]);

  const handleInscribirse = useCallback(async (desafioId: number) => {
    if (!usuario) return;
    try {
      await desafioService.inscribirse(desafioId, usuario.id);
      setInscritos((prev) => new Set(prev).add(desafioId));
      notify('success', 'Te has inscrito al desafío correctamente');
    } catch {
      notify('error', 'No se pudo completar la inscripción');
    }
  }, [usuario, notify]);

  const handleDesistir = useCallback(async (desafioId: number) => {
    if (!usuario) return;
    try {
      await desafioService.desistir(desafioId, usuario.id);
      setInscritos((prev) => { const next = new Set(prev); next.delete(desafioId); return next; });
      notify('success', 'Te has desinscrito del desafío');
    } catch {
      notify('error', 'No se pudo completar la desinscripción');
    }
  }, [usuario, notify]);

  if (isLoading) return <Skeleton rows={3} />;
  if (error) return <ErrorMessage error={error} onRetry={refetch} />;
  if (!data || data.length === 0) {
    return <EmptyState title="No hay desafíos activos" description="Vuelve más tarde para encontrar nuevos desafíos." />;
  }

  return (
    <div className="desafios-list">
      {data.map((d) => (
        <DesafioCard
          key={d.id}
          usuarioDesafio={{ desafio: d, progresoActual: d.progresoActual ?? 0, completado: d.completado ?? false }}
          inscrito={inscritos.has(d.id)}
          onInscribirse={handleInscribirse}
          onDesistir={handleDesistir}
        />
      ))}
    </div>
  );
}
