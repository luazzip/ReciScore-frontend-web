import axiosClient from '../api/axiosClient';
import type { Usuario } from '../types/usuario.types';

export const userService = {
  async getById(id: number, signal?: AbortSignal): Promise<Usuario> {
    const { data } = await axiosClient.get<Usuario>(`/users/${id}`, { signal });
    return data;
  },
  async update(id: number, payload: Partial<Usuario>): Promise<Usuario> {
    const { data } = await axiosClient.patch<Usuario>(`/users/${id}`, payload);
    return data;
  },
  async delete(id: number): Promise<void> {
    await axiosClient.delete(`/users/${id}`);
  },
};
