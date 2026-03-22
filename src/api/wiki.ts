import { api } from './client';

export interface WikiEntry {
  id: number;
  title: string;
  content: string;
  image: string;
  mob: number;
  item: string;
  seo: string;
  status: number;
}

export const wikiApi = {
  getEntries: (type?: string) =>
    api.get<WikiEntry[]>(`/wiki${type ? `?type=${type}` : ''}`),
  getEntry: (id: number) => api.get<WikiEntry>(`/wiki/${id}`),
};
