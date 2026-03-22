import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { User, Coins, Mail, Shield, LogOut } from 'lucide-react';

export default function Profile() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) return <Navigate to="/giris" replace />;

  return (
    <Layout>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ fontFamily: 'Cinzel, serif', lineHeight: '1.1' }}>
          <User className="h-6 w-6 text-primary" />
          Profilim
        </h1>

        <Card className="glass-card glow-gold">
          <CardContent className="p-6 space-y-5">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-2xl font-bold text-primary" style={{ fontFamily: 'Cinzel, serif' }}>
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{user?.username}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" /> {user?.email || 'E-posta belirtilmemiş'}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-secondary/40 p-4 text-center">
                <Coins className="h-5 w-5 text-primary mx-auto mb-1" />
                <p className="text-xl font-bold text-foreground tabular-nums">{user?.coins ?? 0}</p>
                <p className="text-xs text-muted-foreground">Dragon Coin</p>
              </div>
              <div className="rounded-lg bg-secondary/40 p-4 text-center">
                <Shield className="h-5 w-5 text-primary mx-auto mb-1" />
                <p className="text-xl font-bold text-foreground tabular-nums">{user?.ep ?? 0}</p>
                <p className="text-xs text-muted-foreground">EP Bakiye</p>
              </div>
            </div>

            <Button variant="destructive" className="w-full active:scale-[0.97] transition-transform" onClick={logout}>
              <LogOut className="h-4 w-4" />
              Çıkış Yap
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
