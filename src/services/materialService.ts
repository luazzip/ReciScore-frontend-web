import axiosClient from '../api/axiosClient';
import type { Material } from '../types/material.types';

export const materialService = {
  async getAll(signal?: AbortSignal): Promise<Material[]> {
    const { data } = await axiosClient.get<Material[]>('/material', { signal });
    return data;
  },
  async getById(id: number, signal?: AbortSignal): Promise<Material> {
    const { data } = await axiosClient.get<Material>(`/material/${id}`, { signal });
    return data;
  },
  async getByCategory(category: string, signal?: AbortSignal): Promise<Material[]> {
    const { data } = await axiosClient.get<Material[]>(`/material/category/${category}`, { signal });
    return data;
  },
};
