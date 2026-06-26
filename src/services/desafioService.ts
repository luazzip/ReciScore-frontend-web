import axiosClient from '../api/axiosClient';
import type { Desafio } from '../types/desafio.types';

export const desafioService = {
  async getActivos(signal?: AbortSignal): Promise<Desafio[]> {
    const { data } = await axiosClient.get<Desafio[]>('/desafios', { signal });
    return data;
  },
  async getActivosConInscripcion(userId: number, signal?: AbortSignal): Promise<Desafio[]> {
    const { data } = await axiosClient.get<Desafio[]>(`/desafios/usuario/${userId}`, { signal });
    return data;
  },
  async getById(id: number, signal?: AbortSignal): Promise<Desafio> {
    const { data } = await axiosClient.get<Desafio>(`/desafios/${id}`, { signal });
    return data;
  },
  async create(payload: Omit<Desafio, 'id' | 'activo'>): Promise<Desafio> {
    const { data } = await axiosClient.post<Desafio>('/desafios', payload);
    return data;
  },
  async inscribirse(desafioId: number, userId: number): Promise<void> {
    await axiosClient.post(`/desafios/${desafioId}/unirse`, null, {
      params: { userId },
    });
  },
  async desistir(desafioId: number, userId: number): Promise<void> {
    await axiosClient.delete(`/desafios/${desafioId}/desistir`, {
      params: { userId },
    });
  },
};
