import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, User } from '@/api/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, password: string, email: string, extra?: Record<string, string>) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const res = await authApi.login(username, password);
    if (res.success && res.data) {
      const d = res.data as any;
      const token = d.token;
      const userData = d.user || d;
      if (token) localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    }
    return { success: false, error: res.error || (res.data as any)?.error || 'Giris basarisiz' };
  }, []);

  const register = useCallback(async (username: string, password: string, email: string, extra?: Record<string, string>) => {
    const res = await authApi.register(username, password, email, extra);
    if (res.success) return { success: true };
    return { success: false, error: res.error || 'Kayit basarisiz' };
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const res = await authApi.getProfile();
    if (res.success && res.data) {
      const d = res.data as any;
      const userData = d.user || d;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    }
  }, []);

  const isAdmin = !!(user as any)?.is_admin;

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, isAdmin, login, register, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
