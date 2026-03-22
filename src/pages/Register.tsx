import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Shield, Loader2, Eye, EyeOff } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { toast } from 'sonner';
import { authApi } from '@/api/auth';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    real_name: '',
    username: '',
    email: '',
    password: '',
    password2: '',
    pin: '',
    phone: '',
    delete_code: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (key: string, val: string) => setForm(p => ({ ...p, [key]: val }));

  const validate = (): string | null => {
    if (!form.real_name.trim()) return 'Adınızı giriniz';
    if (form.real_name.length < 2 || form.real_name.length > 30) return 'Ad 2-30 karakter olmalıdır';
    if (!form.username.trim()) return 'Hesap adı giriniz';
    if (form.username.length < 5 || form.username.length > 25) return 'Hesap adı 5-25 karakter olmalıdır';
    if (!/^[a-zA-Z0-9_]+$/.test(form.username)) return 'Hesap adı sadece harf, rakam ve _ içerebilir';
    if (!form.email.trim() || !form.email.includes('@')) return 'Geçerli bir e-posta giriniz';
    if (form.password.length < 8 || form.password.length > 16) return 'Şifre 8-16 karakter olmalıdır';
    if (form.password !== form.password2) return 'Şifreler uyuşmuyor';
    if (!/^\d{5}$/.test(form.pin)) return 'Pin şifresi 5 haneli rakam olmalıdır';
    if (form.phone && !/^\d{10}$/.test(form.phone)) return 'Telefon numarası 10 haneli olmalıdır (5XX XXX XX XX)';
    if (!/^\d{7}$/.test(form.delete_code)) return 'Karakter silme kodu 7 haneli rakam olmalıdır';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    setError('');
    try {
      const res = await authApi.register(form.username, form.password, form.email, {
        real_name: form.real_name,
        social_id: form.delete_code,
        phone: form.phone ? `+90${form.phone}` : '',
        pin: form.pin,
      });
      if (res.success) {
        toast.success('Kayıt başarılı! Giriş yapabilirsiniz.');
        navigate('/giris');
      } else {
        setError(res.error || 'Kayıt başarısız');
      }
    } catch {
      setError('Bir hata oluştu');
    }
    setLoading(false);
  };

  return (
    <Layout>
      <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <Shield className="h-12 w-12 text-primary mx-auto mb-3" />
            <h1 className="text-3xl font-bold text-primary tracking-wide" style={{ fontFamily: 'Cinzel, serif' }}>
              KAYIT OL
            </h1>
            <p className="text-muted-foreground mt-1">Maceraya katılmak için hesap oluşturun</p>
          </div>

          {/* Form Card */}
          <div className="rounded-xl border border-border/60 bg-card/60 backdrop-blur-md p-6 md:p-8 shadow-lg shadow-black/30">
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Adınız */}
              <FormRow label="Adınız" hint="2-30 karakter">
                <Input
                  value={form.real_name}
                  onChange={e => set('real_name', e.target.value)}
                  placeholder="Adınız Soyadınız"
                  maxLength={30}
                  className="bg-background/60 border-border/50 focus:border-primary"
                />
              </FormRow>

              {/* Hesap Adı */}
              <FormRow label="Hesap Adı" hint="5-25 karakter, harf ve rakam">
                <Input
                  value={form.username}
                  onChange={e => set('username', e.target.value)}
                  placeholder="ornek_hesap"
                  maxLength={25}
                  autoComplete="username"
                  className="bg-background/60 border-border/50 focus:border-primary"
                />
              </FormRow>

              {/* Mail */}
              <FormRow label="Mail Adresi">
                <Input
                  type="email"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  placeholder="ornek@email.com"
                  autoComplete="email"
                  className="bg-background/60 border-border/50 focus:border-primary"
                />
              </FormRow>

              {/* Şifre */}
              <FormRow label="Şifre" hint="8-16 karakter">
                <div className="relative">
                  <Input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => set('password', e.target.value)}
                    placeholder="••••••••"
                    maxLength={16}
                    autoComplete="new-password"
                    className="bg-background/60 border-border/50 focus:border-primary pr-10"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </FormRow>

              {/* Tekrar Şifre */}
              <FormRow label="Tekrar Şifre" hint="8-16 karakter">
                <div className="relative">
                  <Input
                    type={showPass2 ? 'text' : 'password'}
                    value={form.password2}
                    onChange={e => set('password2', e.target.value)}
                    placeholder="••••••••"
                    maxLength={16}
                    autoComplete="new-password"
                    className="bg-background/60 border-border/50 focus:border-primary pr-10"
                  />
                  <button type="button" onClick={() => setShowPass2(!showPass2)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPass2 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </FormRow>

              {/* Pin Şifresi + Karakter Silme Kodu - yan yana */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormRow label="Pin Şifresi" hint="5 haneli rakam">
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={form.pin}
                    onChange={e => { if (/^\d{0,5}$/.test(e.target.value)) set('pin', e.target.value); }}
                    placeholder="00000"
                    maxLength={5}
                    className="bg-background/60 border-border/50 focus:border-primary tracking-widest text-center"
                  />
                </FormRow>

                <FormRow label="Karakter Silme Kodu" hint="7 haneli rakam">
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={form.delete_code}
                    onChange={e => { if (/^\d{0,7}$/.test(e.target.value)) set('delete_code', e.target.value); }}
                    placeholder="0000000"
                    maxLength={7}
                    className="bg-background/60 border-border/50 focus:border-primary tracking-widest text-center"
                  />
                </FormRow>
              </div>

              {/* Telefon */}
              <FormRow label="Telefon Numaranız" hint="İsteğe bağlı">
                <div className="flex gap-2">
                  <div className="flex items-center gap-1.5 rounded-md border border-border/50 bg-background/60 px-3 text-sm text-muted-foreground min-w-[80px] justify-center">
                    <span className="text-xs">🇹🇷</span>
                    <span>+90</span>
                  </div>
                  <Input
                    type="tel"
                    inputMode="numeric"
                    value={form.phone}
                    onChange={e => { if (/^\d{0,10}$/.test(e.target.value)) set('phone', e.target.value); }}
                    placeholder="5XX XXX XX XX"
                    maxLength={10}
                    className="bg-background/60 border-border/50 focus:border-primary flex-1"
                  />
                </div>
              </FormRow>

              {/* Error */}
              {error && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/80 text-primary-foreground active:scale-[0.97] transition-all"
                disabled={loading}
              >
                {loading && <Loader2 className="h-5 w-5 animate-spin mr-2" />}
                Kayıt Ol
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Zaten hesabınız var mı?{' '}
                <Link to="/giris" className="text-primary hover:underline font-medium">Giriş Yap</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

/* Reusable form row with gold label on left */
function FormRow({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-2 md:gap-4 items-start">
      <div className="flex flex-col pt-2">
        <span className="text-sm font-semibold text-primary" style={{ fontFamily: 'Cinzel, serif' }}>{label}</span>
        {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
      </div>
      <div>{children}</div>
    </div>
  );
}
