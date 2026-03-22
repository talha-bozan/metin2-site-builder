import { ReactNode } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard, Users, Package, Tag, Calendar, Newspaper, LifeBuoy,
  ScrollText, Gamepad2, Search, Settings, Shield, Gift, Send, BookOpen,
  Boxes, LogOut, ChevronRight, Menu, X
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const menuItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/hesaplar', label: 'Hesaplar', icon: Users },
  { path: '/admin/urunler', label: 'Urunler', icon: Package },
  { path: '/admin/kategoriler', label: 'Kategoriler', icon: Tag },
  { path: '/admin/kuponlar', label: 'Kuponlar', icon: Gift },
  { path: '/admin/etkinlikler', label: 'Etkinlikler', icon: Calendar },
  { path: '/admin/haberler', label: 'Haberler', icon: Newspaper },
  { path: '/admin/paketler', label: 'Paketler', icon: Boxes },
  { path: '/admin/ticketlar', label: 'Ticketlar', icon: LifeBuoy },
  { path: '/admin/loglar', label: 'Loglar', icon: ScrollText },
  { path: '/admin/oyuncular', label: 'Oyuncular', icon: Gamepad2 },
  { path: '/admin/proto', label: 'Proto Arama', icon: Search },
  { path: '/admin/item-ver', label: 'Item Ver', icon: Send },
  { path: '/admin/socket', label: 'Sunucu Komut', icon: Send },
  { path: '/admin/wiki', label: 'Wiki', icon: BookOpen },
  { path: '/admin/ayarlar', label: 'Ayarlar', icon: Settings },
  { path: '/admin/kullanicilar', label: 'Panel Kullanicilari', icon: Shield },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/giris" replace />;
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform lg:translate-x-0 lg:static lg:inset-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <Link to="/admin" className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-foreground" style={{ fontFamily: 'Cinzel, serif' }}>Admin Panel</span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User info */}
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-medium text-foreground">{user?.username}</p>
            <p className="text-xs text-muted-foreground">Yonetici</p>
          </div>

          {/* Menu */}
          <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                  }`}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-3 border-t border-border space-y-1">
            <Link
              to="/"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
              Siteye Don
            </Link>
            <button
              onClick={logout}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Cikis Yap
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-border px-4 py-3 lg:px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-muted-foreground hover:text-foreground">
            <Menu className="h-5 w-5" />
          </button>
          <div className="text-sm text-muted-foreground">
            {menuItems.find(m => m.path === location.pathname)?.label || 'Admin Panel'}
          </div>
          <div className="text-xs text-muted-foreground">{user?.username}</div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
