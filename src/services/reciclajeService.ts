import axiosClient from '../api/axiosClient';
import type { RegistrarReciclajeRequest, ReporteReciclaje } from '../types/reciclaje.types';

export const reciclajeService = {
  async registrar(payload: RegistrarReciclajeRequest, signal?: AbortSignal): Promise<ReporteReciclaje> {
    const { data } = await axiosClient.post<ReporteReciclaje>('/reportes-reciclaje', payload, { signal });
    return data;
  },
  async getHistorial(
    userId: number,
    params: { page?: number; size?: number },
    signal?: AbortSignal
  ): Promise<ReporteReciclaje[]> {
    const { data } = await axiosClient.get<ReporteReciclaje[]>(`/reportes-reciclaje/historial/${userId}`, {
      params,
      signal,
    });
    return data;
  },
  async getById(id: number, signal?: AbortSignal): Promise<ReporteReciclaje> {
    const { data } = await axiosClient.get<ReporteReciclaje>(`/reportes-reciclaje/${id}`, { signal });
    return data;
  },
  async delete(id: number): Promise<void> {
    await axiosClient.delete(`/reportes-reciclaje/${id}`);
  },
};
