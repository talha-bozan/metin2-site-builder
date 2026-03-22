import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Shield, Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) { setError('Tüm alanları doldurunuz'); return; }
    setLoading(true);
    setError('');
    const res = await login(username, password);
    setLoading(false);
    if (res.success) navigate('/');
    else setError(res.error || 'Giriş başarısız');
  };

  return (
    <Layout>
      <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md glass-card glow-gold">
          <CardHeader className="text-center space-y-2">
            <Shield className="h-10 w-10 text-primary mx-auto" />
            <CardTitle className="text-xl" style={{ fontFamily: 'Cinzel, serif' }}>Giriş Yap</CardTitle>
            <CardDescription>Hesabınıza giriş yapın</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Kullanıcı Adı</Label>
                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Kullanıcı adınız" autoComplete="username" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Şifre</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full active:scale-[0.97] transition-transform" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Giriş Yap
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Hesabınız yok mu?{' '}
                <Link to="/kayit" className="text-primary hover:underline">Kayıt Ol</Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
