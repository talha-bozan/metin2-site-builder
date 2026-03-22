import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coins, CreditCard, Zap, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const epPrices = [
  { id: 1, ep: 30, tl: 10 }, { id: 2, ep: 60, tl: 20 }, { id: 3, ep: 90, tl: 30 },
  { id: 4, ep: 120, tl: 40 }, { id: 5, ep: 150, tl: 50 }, { id: 6, ep: 180, tl: 60 },
  { id: 7, ep: 210, tl: 70 }, { id: 8, ep: 240, tl: 80 }, { id: 9, ep: 270, tl: 90 },
  { id: 10, ep: 300, tl: 100 }, { id: 11, ep: 700, tl: 200 }, { id: 12, ep: 1200, tl: 300 },
  { id: 13, ep: 1550, tl: 400 }, { id: 14, ep: 2000, tl: 500 },
];

const paymentMethods = [
  { id: 'paytr', name: 'PayTR', desc: 'Kredi kartı ile ödeme' },
  { id: 'paywant', name: 'PayWant', desc: 'Mobil ödeme' },
  { id: 'kasagame', name: 'KasaGame', desc: 'Oyun kartı ile ödeme' },
];

// Find the best value
const bestValueId = 14; // 2000 EP for 500 TL has best EP/TL ratio

export default function EPYukle() {
  const { isAuthenticated, user } = useAuth();

  const handlePurchase = (ep: number, tl: number) => {
    if (!isAuthenticated) { toast.error('EP yüklemek için giriş yapınız'); return; }
    toast.info(`${ep} EP — ${tl} TL ödeme sayfasına yönlendiriliyorsunuz...`);
  };

  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2" style={{ fontFamily: 'Cinzel, serif', lineHeight: '1.1' }}>
          <Coins className="h-6 w-6 text-primary" />
          EP (Dragon Coin) Yükle
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          Dragon Coin satın alarak nesne marketinden alışveriş yapabilirsiniz.
          {isAuthenticated && (
            <span className="ml-2 text-primary font-medium">Mevcut bakiye: {user?.coins ?? 0} DC</span>
          )}
        </p>

        {/* Payment Methods */}
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

        {/* EP Packages */}
        <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: 'Cinzel, serif' }}>Paketler</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {epPrices.map((p) => {
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
                        <Check className="h-3 w-3 mr-0.5" /> En Avantajlı
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{epPerTl} EP/TL</span>
                    <span className="text-lg font-bold text-foreground tabular-nums">{p.tl} ₺</span>
                  </div>
                  <Button
                    className="w-full active:scale-[0.97] transition-transform"
                    variant={isBest ? 'default' : 'outline'}
                    onClick={() => handlePurchase(p.ep, p.tl)}
                  >
                    Satın Al
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
