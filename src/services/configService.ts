import axiosClient from '../api/axiosClient';

export const configService = {
  async getPesosPorTamano(signal?: AbortSignal): Promise<Record<string, number>> {
    const { data } = await axiosClient.get<Record<string, number>>('/config/pesos-por-tamano', { signal });
    return data;
  },
  async getDistritos(signal?: AbortSignal): Promise<string[]> {
    const { data } = await axiosClient.get<string[]>('/config/distritos', { signal });
    return data;
  },
};
