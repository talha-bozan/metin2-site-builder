import { api } from './client';

export interface User {
  id: number;
  username: string;
  email: string;
  coins: number;
  ep: number;
}

export const authApi = {
  login: (username: string, password: string) =>
    api.post<{ token: string; user: User }>('/login', { username, password }),

  register: (username: string, password: string, email: string) =>
    api.post('/register', { username, password, email }),

  getProfile: () => api.get<User>('/profile'),

  updateProfile: (data: Partial<User>) => api.put('/profile', data),

  changePassword: (oldPassword: string, newPassword: string) =>
    api.post('/change-password', { old_password: oldPassword, new_password: newPassword }),

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },
};
