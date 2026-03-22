import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, ShoppingBag, Calendar, BookOpen, LifeBuoy, Coins, User, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { label: 'Ana Sayfa', path: '/', icon: Shield },
  { label: 'Market', path: '/market', icon: ShoppingBag },
  { label: 'Etkinlikler', path: '/etkinlikler', icon: Calendar },
  { label: 'Wiki', path: '/wiki', icon: BookOpen },
  { label: 'Destek', path: '/destek', icon: LifeBuoy },
  { label: 'EP Yükle', path: '/ep-yukle', icon: Coins },
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-gold" />
            <span className="font-cinzel text-xl font-bold tracking-wide text-gold" style={{ fontFamily: 'Cinzel, serif' }}>
              METIN2
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-secondary text-gold'
                      : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Auth */}
          <div className="hidden items-center gap-2 md:flex">
            {isAuthenticated ? (
              <>
                <span className="flex items-center gap-1 text-sm text-gold">
                  <Coins className="h-4 w-4" />
                  {user?.coins ?? 0} DC
                </span>
                <Link to="/profil">
                  <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
                    <User className="h-4 w-4" />
                    {user?.username}
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={logout} className="text-muted-foreground hover:text-destructive">
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Link to="/giris">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    Giriş Yap
                  </Button>
                </Link>
                <Link to="/kayit">
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/80">
                    Kayıt Ol
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="border-t border-border/50 pb-4 pt-2 md:hidden">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 rounded-md px-3 py-2.5 text-sm ${
                  location.pathname === item.path ? 'bg-secondary text-gold' : 'text-muted-foreground'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-border/50 pt-2">
              {isAuthenticated ? (
                <>
                  <Link to="/profil" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-foreground">
                    <User className="h-4 w-4" /> {user?.username} — {user?.coins ?? 0} DC
                  </Link>
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="flex items-center gap-2 px-3 py-2 text-sm text-destructive">
                    <LogOut className="h-4 w-4" /> Çıkış Yap
                  </button>
                </>
              ) : (
                <div className="flex gap-2 px-3">
                  <Link to="/giris" onClick={() => setMobileOpen(false)} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">Giriş Yap</Button>
                  </Link>
                  <Link to="/kayit" onClick={() => setMobileOpen(false)} className="flex-1">
                    <Button size="sm" className="w-full">Kayıt Ol</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
