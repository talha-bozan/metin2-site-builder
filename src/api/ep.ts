import { api } from './client';

export interface EpPrice {
  id: number;
  ep: number;
  tl: number;
}

export const epApi = {
  getPrices: () => api.get<EpPrice[]>('/ep/prices'),
  purchase: (priceId: number, paymentMethod: string) =>
    api.post('/ep/purchase', { price_id: priceId, payment_method: paymentMethod }),
};
