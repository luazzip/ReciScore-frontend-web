import { useState, useCallback } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { desafioService } from '../../services/desafioService';
import DesafiosListView from './DesafiosListView';
import type { Desafio } from '../../types/desafio.types';

export default function DesafiosList() {
  const { usuario } = useAuth();
  const { notify } = useNotification();
  const { data, isLoading, error, refetch } = useFetch(
    (signal) => usuario ? desafioService.getActivosConInscripcion(usuario.id, signal) : desafioService.getActivos(signal),
    [usuario?.id]
  );

  const desafios: Desafio[] = data ?? [];

  const [inscritos, setInscritos] = useState<Set<number>>(
    () => new Set(desafios.filter((d) => d.inscrito).map((d) => d.id))
  );

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

  return (
    <DesafiosListView
      desafios={desafios}
      inscritos={inscritos}
      isLoading={isLoading}
      error={error}
      onRetry={refetch}
      onInscribirse={handleInscribirse}
      onDesistir={handleDesistir}
    />
  );
}
