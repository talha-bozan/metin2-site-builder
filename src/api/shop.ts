import { api } from './client';

export interface ShopCategory {
  id: number;
  name: string;
  mainmenu: number;
  status: number;
  alone: number;
  icon: string;
  who: number;
  icon_type: number;
  owner: number;
  children?: ShopCategory[];
}

export interface ShopItem {
  id: number;
  item_id: number;
  vnum: number;
  item_name: string;
  item_image: string;
  coins: number;
  count_1: number;
  count_2: number;
  count_3: number;
  count_4: number;
  count_5: number;
  kategori_id: number;
  durum: number;
  item_time: number;
  discount_1: number;
  discount_2: number;
  discount_3: number;
  discount_4: number;
  discount_5: number;
  description: string;
  attrtype0: number;
  attrvalue0: number;
  attrtype1: number;
  attrvalue1: number;
  attrtype2: number;
  attrvalue2: number;
  attrtype3: number;
  attrvalue3: number;
  attrtype4: number;
  attrvalue4: number;
  attrtype5: number;
  attrvalue5: number;
  attrtype6: number;
  attrvalue6: number;
  socket0: number;
  socket1: number;
  socket2: number;
  popularite: number;
  discount_status: number;
  coins_old: number;
  information: string;
  wear_flag: string;
  buy_count: number;
}

export const shopApi = {
  getCategories: () => api.get<ShopCategory[]>('/shop/categories'),
  getItems: (categoryId?: number) =>
    api.get<ShopItem[]>(`/shop/items${categoryId ? `?category=${categoryId}` : ''}`),
  getItem: (id: number) => api.get<ShopItem>(`/shop/items/${id}`),
  purchaseItem: (itemId: number, count: number) =>
    api.post('/shop/purchase', { item_id: itemId, count }),
  searchItems: (query: string) => api.get<ShopItem[]>(`/shop/search?q=${encodeURIComponent(query)}`),
};
