import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Shield, Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { toast } from 'sonner';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !password.trim()) { setError('Tüm alanları doldurunuz'); return; }
    if (password !== password2) { setError('Şifreler uyuşmuyor'); return; }
    if (password.length < 6) { setError('Şifre en az 6 karakter olmalıdır'); return; }
    setLoading(true);
    setError('');
    const res = await register(username, password, email);
    setLoading(false);
    if (res.success) {
      toast.success('Kayıt başarılı! Giriş yapabilirsiniz.');
      navigate('/giris');
    } else {
      setError(res.error || 'Kayıt başarısız');
    }
  };

  return (
    <Layout>
      <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md glass-card glow-gold">
          <CardHeader className="text-center space-y-2">
            <Shield className="h-10 w-10 text-primary mx-auto" />
            <CardTitle className="text-xl" style={{ fontFamily: 'Cinzel, serif' }}>Kayıt Ol</CardTitle>
            <CardDescription>Yeni hesap oluşturun</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Kullanıcı Adı</Label>
                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Kullanıcı adınız" autoComplete="username" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ornek@email.com" autoComplete="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Şifre</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="new-password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password2">Şifre Tekrar</Label>
                <Input id="password2" type="password" value={password2} onChange={(e) => setPassword2(e.target.value)} placeholder="••••••••" autoComplete="new-password" />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full active:scale-[0.97] transition-transform" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Kayıt Ol
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Zaten hesabınız var mı?{' '}
                <Link to="/giris" className="text-primary hover:underline">Giriş Yap</Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
