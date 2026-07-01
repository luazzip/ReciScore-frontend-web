import { useFetch } from '../../hooks/useFetch';
import { mapaService } from '../../services/mapaService';
import MapaPuntosView from './MapaPuntosView';
import type { PuntoMapa } from '../../types/puntoMapa.types';

export default function MapaPuntos() {
  const { data, isLoading, error, refetch } = useFetch((signal) => mapaService.getPuntos(signal), []);

  const puntos: PuntoMapa[] = data ?? [];

  return (
    <MapaPuntosView
      puntos={puntos}
      isLoading={isLoading}
      error={error}
      onRetry={refetch}
    />
  );
}
