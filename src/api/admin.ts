import { api } from './client';

export const adminApi = {
  // Dashboard
  getDashboard: () => api.get('/admin/dashboard'),

  // Accounts
  getAccounts: (page = 1) => api.get(`/admin/accounts?page=${page}`),
  searchAccounts: (query: string) => api.post('/admin/accounts/search', { query }),
  getAccount: (id: number) => api.get(`/admin/accounts/${id}`),
  createAccount: (data: any) => api.post('/admin/accounts/create', data),
  banAccount: (id: number, reason: string) => api.post(`/admin/accounts/${id}/ban`, { reason }),
  unbanAccount: (id: number) => api.post(`/admin/accounts/${id}/unban`, {}),
  addEP: (id: number, amount: number, reason: string) => api.post(`/admin/accounts/${id}/ep`, { amount, reason }),
  getBanList: () => api.get('/admin/accounts/banlist'),

  // Products
  getProducts: (page = 1) => api.get(`/admin/products?page=${page}`),
  getProduct: (id: number) => api.get(`/admin/products/${id}`),
  addProduct: (data: any) => api.post('/admin/products/add', data),
  updateProduct: (id: number, data: any) => api.put(`/admin/products/${id}`, data),
  deleteProduct: (id: number) => api.delete(`/admin/products/${id}`),
  toggleDiscount: (id: number, status: number) => api.post(`/admin/products/${id}/discount`, { status }),
  togglePopular: (id: number, status: number) => api.post(`/admin/products/${id}/popular`, { status }),

  // Categories
  getCategories: () => api.get('/admin/products/categories'),
  addCategory: (data: any) => api.post('/admin/products/categories', data),
  deleteCategory: (id: number) => api.delete(`/admin/products/categories/${id}`),

  // Bonuses
  getBonuses: () => api.get('/admin/products/bonuses'),
  addBonus: (data: any) => api.post('/admin/products/bonuses', data),
  deleteBonus: (id: number) => api.delete(`/admin/products/bonuses/${id}`),

  // Wheel
  getWheelItems: () => api.get('/admin/products/wheel'),
  addWheelItem: (data: any) => api.post('/admin/products/wheel', data),
  deleteWheelItem: (id: number) => api.delete(`/admin/products/wheel/${id}`),

  // Coupons
  getCoupons: () => api.get('/admin/coupons'),
  getUsedCoupons: () => api.get('/admin/coupons/used'),
  createCoupon: (data: any) => api.post('/admin/coupons', data),
  deleteCoupon: (id: number) => api.delete(`/admin/coupons/${id}`),

  // Events
  getEvents: () => api.get('/admin/events'),
  createEvent: (data: any) => api.post('/admin/events', data),
  updateEvent: (id: number, data: any) => api.put(`/admin/events/${id}`, data),
  deleteEvent: (id: number) => api.delete(`/admin/events/${id}`),

  // News
  getNews: () => api.get('/admin/news'),
  createNews: (data: any) => api.post('/admin/news', data),
  deleteNews: (id: number) => api.delete(`/admin/news/${id}`),

  // Packs
  getPacks: () => api.get('/admin/packs'),
  createPack: (data: any) => api.post('/admin/packs', data),
  deletePack: (id: number) => api.delete(`/admin/packs/${id}`),

  // Tickets
  getReadTickets: () => api.get('/admin/tickets/read'),
  getUnreadTickets: () => api.get('/admin/tickets/unread'),
  getTicket: (id: number) => api.get(`/admin/tickets/${id}`),
  replyTicket: (id: number, message: string) => api.post(`/admin/tickets/${id}/reply`, { message }),
  closeTicket: (id: number) => api.post(`/admin/tickets/${id}/close`, {}),

  // Logs
  getShopLogs: (page = 1) => api.get(`/admin/logs/shop?page=${page}`),
  getBanLogs: (page = 1) => api.get(`/admin/logs/ban?page=${page}`),
  getPaymentLogs: (page = 1) => api.get(`/admin/logs/payments?page=${page}`),

  // Players
  searchPlayers: (query: string) => api.post('/admin/players/search', { query }),
  getPlayer: (id: number) => api.get(`/admin/players/${id}`),

  // Proto
  searchProto: (query: string) => api.get(`/admin/proto/search?q=${encodeURIComponent(query)}`),

  // Settings
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data: any) => api.put('/admin/settings', data),

  // Users (admin panel users)
  getUsers: () => api.get('/admin/users'),
  createUser: (data: any) => api.post('/admin/users', data),
  deleteUser: (id: number) => api.delete(`/admin/users/${id}`),

  // Items (give items)
  searchItems: (query: string) => api.get(`/admin/items/search?q=${encodeURIComponent(query)}`),
  giveItem: (data: any) => api.post('/admin/items/give', data),
  getApplyTypes: () => api.get('/admin/items/apply-types'),
  getItemHistory: (page = 1) => api.get(`/admin/items/history?page=${page}`),

  // Socket (game server commands)
  dcPlayer: (name: string) => api.post('/admin/socket/dc', { name }),
  sendChat: (message: string) => api.post('/admin/socket/chat', { message }),
  sendNotice: (message: string) => api.post('/admin/socket/notice', { message }),

  // Wiki
  getWikiEntries: () => api.get('/admin/wiki'),
  createWiki: (data: any) => api.post('/admin/wiki', data),
  updateWiki: (id: number, data: any) => api.put(`/admin/wiki/${id}`, data),
  deleteWiki: (id: number) => api.delete(`/admin/wiki/${id}`),
};
