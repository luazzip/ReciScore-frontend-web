import axiosClient from '../api/axiosClient';
import type { RankingEntry } from '../types/ranking.types';

export const rankingService = {
  async getGlobal(signal?: AbortSignal): Promise<RankingEntry[]> {
    const { data } = await axiosClient.get<RankingEntry[]>('/ranking', { signal });
    return data;
  },
  async getPorDistrito(location: string, signal?: AbortSignal): Promise<RankingEntry[]> {
    const { data } = await axiosClient.get<RankingEntry[]>(`/ranking/distrito/${encodeURIComponent(location)}`, { signal });
    return data;
  },
};
