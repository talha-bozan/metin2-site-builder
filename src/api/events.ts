import { api } from './client';

export interface GameEvent {
  id: number;
  day: string;
  name: string;
  time: string;
  owner: number;
}

export const eventsApi = {
  getEvents: () => api.get<GameEvent[]>('/events'),
};
