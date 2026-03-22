import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coins, CreditCard, Zap, Check, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { epApi } from '@/api/ep';

const paymentMethods = [
  { id: 'paytr', name: 'PayTR', desc: 'Kredi karti ile odeme' },
  { id: 'paywant', name: 'PayWant', desc: 'Mobil odeme' },
  { id: 'kasagame', name: 'KasaGame', desc: 'Oyun karti ile odeme' },
];

export default function EPYukle() {
  const { isAuthenticated, user } = useAuth();
  const [epPrices, setEpPrices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    epApi.getPrices().then(res => {
      if (res.success && res.data) setEpPrices(Array.isArray(res.data) ? res.data : []);
      setLoading(false);
    });
  }, []);

  const bestValueId = epPrices.length > 0 ? epPrices[epPrices.length - 1]?.id : null;

  const handlePurchase = (ep: number, tl: number) => {
    if (!isAuthenticated) { toast.error('EP yuklemek icin giris yapiniz'); return; }
    toast.info(`${ep} EP — ${tl} TL odeme sayfasina yonlendiriliyorsunuz...`);
  };

  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2" style={{ fontFamily: 'Cinzel, serif', lineHeight: '1.1' }}>
          <Coins className="h-6 w-6 text-primary" />
          EP (Dragon Coin) Yukle
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          Dragon Coin satin alarak nesne marketinden alisveris yapabilirsiniz.
          {isAuthenticated && (
            <span className="ml-2 text-primary font-medium">Mevcut bakiye: {user?.coins ?? 0} DC</span>
          )}
        </p>

        <div className="grid gap-3 sm:grid-cols-3 mb-8">
          {paymentMethods.map((m) => (
            <Card key={m.id} className="glass-card hover:border-primary/30 transition-all cursor-pointer glow-gold-hover">
              <CardContent className="flex items-center gap-3 p-4">
                <CreditCard className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: 'Cinzel, serif' }}>Paketler</h2>

        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {epPrices.map((p: any) => {
              const isBest = p.id === bestValueId;
              const epPerTl = (p.ep / p.tl).toFixed(1);
              return (
                <Card
                  key={p.id}
                  className={`glass-card transition-all glow-gold-hover hover:border-primary/30 ${isBest ? 'border-primary/40 glow-gold' : ''}`}
                >
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-primary" />
                        <span className="text-lg font-bold text-foreground tabular-nums">{p.ep.toLocaleString()} EP</span>
                      </div>
                      {isBest && (
                        <Badge className="bg-primary/20 text-primary text-[10px]">
                          <Check className="h-3 w-3 mr-0.5" /> En Avantajli
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{epPerTl} EP/TL</span>
                      <span className="text-lg font-bold text-foreground tabular-nums">{p.tl} TL</span>
                    </div>
                    <Button
                      className="w-full active:scale-[0.97] transition-transform"
                      variant={isBest ? 'default' : 'outline'}
                      onClick={() => handlePurchase(p.ep, p.tl)}
                    >
                      Satin Al
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
