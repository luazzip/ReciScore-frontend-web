import axiosClient from '../api/axiosClient';
import type { PuntoMapa, NuevoReporteZonaRequest, ReporteZona } from '../types/puntoMapa.types';

export const mapaService = {
  async getPuntos(signal?: AbortSignal): Promise<PuntoMapa[]> {
    const { data } = await axiosClient.get<PuntoMapa[]>('/puntos-mapa', { signal });
    return data;
  },
  async getPuntoById(id: number, signal?: AbortSignal): Promise<PuntoMapa> {
    const { data } = await axiosClient.get<PuntoMapa>(`/puntos-mapa/${id}`, { signal });
    return data;
  },
  async validarUbicacion(lat: number, lng: number, signal?: AbortSignal): Promise<boolean> {
    const { data } = await axiosClient.get<boolean>('/puntos-mapa/validar', {
      params: { lat, lng },
      signal,
    });
    return data;
  },
  async reportarZonaSucia(payload: NuevoReporteZonaRequest, signal?: AbortSignal): Promise<ReporteZona> {
    const { data } = await axiosClient.post<ReporteZona>('/reportes-zona', payload, { signal });
    return data;
  },
};
