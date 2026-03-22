import { api } from './client';

export interface Banner {
  id: number;
  type: string;
  image: string;
  title: string;
  content: string;
}

export interface ServerStatus {
  online: boolean;
  players: number;
  channels: { name: string; port: number; status: boolean }[];
}

export interface News {
  id: number;
  title: string;
  content: string;
  image: string;
  tarih: string;
}

export const generalApi = {
  getBanners: () => api.get<Banner[]>('/banners'),
  getServerStatus: () => api.get<ServerStatus>('/server-status'),
  getNews: () => api.get<News[]>('/news'),
  getSettings: () => api.get<Record<string, string>>('/settings'),
};
