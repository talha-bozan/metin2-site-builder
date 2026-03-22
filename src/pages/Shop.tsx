import { useState, useMemo } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Search, ShoppingCart, ChevronRight, Star, Coins, Package } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Categories from shop_menu table
const mainCategories = [
  { id: 1, name: 'Kuşanma', icon: '⚔️' },
  { id: 2, name: 'Stil', icon: '👗' },
  { id: 3, name: 'Hizmet', icon: '🛠️' },
  { id: 4, name: 'Arındırma & Geliştirme', icon: '✨' },
];

const subCategories: Record<number, { id: number; name: string }[]> = {
  1: [
    { id: 5, name: 'Silahlar (PvM)' }, { id: 6, name: 'Zırhlar (PvM)' }, { id: 7, name: 'Takılar (PvM)' },
    { id: 8, name: 'Kask & Kalkan (PvM)' }, { id: 9, name: 'Silahlar (PvP)' }, { id: 10, name: 'Zırhlar (PvP)' },
    { id: 11, name: 'Takılar (PvP)' }, { id: 12, name: 'Kask & Kalkan (PvP)' }, { id: 13, name: 'Kemerler' },
  ],
  2: [
    { id: 14, name: 'PvM Kostümleri' }, { id: 15, name: 'PvP Kostümleri' }, { id: 16, name: 'Başlıklar' },
    { id: 17, name: 'Kuşaklar' }, { id: 18, name: 'Kanatlar' }, { id: 19, name: 'Binekler' },
    { id: 20, name: 'Petler' },
  ],
  3: [
    { id: 21, name: 'İksirler' }, { id: 22, name: 'Ruhlar' }, { id: 23, name: 'Beceri Kitapları' },
    { id: 24, name: 'Sandıklar & Kutular' },
  ],
  4: [
    { id: 25, name: 'Değişim Taşları' }, { id: 26, name: 'Yükseltme Taşları' },
    { id: 27, name: 'Efsun Nesneleri' },
  ],
};

// Sample items (in real app these come from API)
const sampleItems = [
  { id: 1, item_name: 'Ejderha Kılıcı+9', item_image: '', coins: 250, kategori_id: 5, description: 'Güçlü PvM silahı, yüksek hasar.', popularite: 1, discount_status: 1, coins_old: 300, buy_count: 847 },
  { id: 2, item_name: 'Karanlık Zırh+9', item_image: '', coins: 320, kategori_id: 6, description: 'Yüksek savunma zırhı, PvM için ideal.', popularite: 1, discount_status: 0, coins_old: 0, buy_count: 612 },
  { id: 3, item_name: 'Anka Kolyesi', item_image: '', coins: 180, kategori_id: 7, description: 'Kritik vuruş artırıcı kolye.', popularite: 0, discount_status: 0, coins_old: 0, buy_count: 334 },
  { id: 4, item_name: 'Ateş Kostümü', item_image: '', coins: 450, kategori_id: 14, description: 'Efsanevi ateş efektli kostüm.', popularite: 1, discount_status: 1, coins_old: 600, buy_count: 1203 },
  { id: 5, item_name: 'Grifon Peti', item_image: '', coins: 500, kategori_id: 20, description: 'Hızlı uçuş yeteneği olan pet.', popularite: 1, discount_status: 0, coins_old: 0, buy_count: 985 },
  { id: 6, item_name: 'Şanslı Sandık', item_image: '', coins: 50, kategori_id: 24, description: 'Nadir eşyalar barındıran sandık.', popularite: 0, discount_status: 0, coins_old: 0, buy_count: 2430 },
  { id: 7, item_name: 'Beceri Kitabı Paketi', item_image: '', coins: 100, kategori_id: 23, description: '5 adet rastgele beceri kitabı.', popularite: 0, discount_status: 0, coins_old: 0, buy_count: 1880 },
  { id: 8, item_name: 'Melek Kanatları', item_image: '', coins: 700, kategori_id: 18, description: 'Hız ve görünüm bonus kanatlar.', popularite: 1, discount_status: 1, coins_old: 900, buy_count: 556 },
  { id: 9, name: 'PvP Kılıcı+9', item_name: 'PvP Kılıcı+9', item_image: '', coins: 380, kategori_id: 9, description: 'Yüksek PvP hasarlı kılıç.', popularite: 0, discount_status: 0, coins_old: 0, buy_count: 720 },
  { id: 10, item_name: 'Ejderha Binit', item_image: '', coins: 800, kategori_id: 19, description: 'En hızlı binek, ateş efekti.', popularite: 1, discount_status: 0, coins_old: 0, buy_count: 421 },
];

export default function Shop() {
  const { isAuthenticated } = useAuth();
  const [selectedMain, setSelectedMain] = useState<number | null>(null);
  const [selectedSub, setSelectedSub] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<(typeof sampleItems)[0] | null>(null);
  const [purchaseCount, setPurchaseCount] = useState(1);

  const filteredItems = useMemo(() => {
    let items = sampleItems;
    if (selectedSub) items = items.filter((i) => i.kategori_id === selectedSub);
    else if (selectedMain) {
      const subIds = (subCategories[selectedMain] || []).map((s) => s.id);
      items = items.filter((i) => subIds.includes(i.kategori_id));
    }
    if (search) items = items.filter((i) => i.item_name.toLowerCase().includes(search.toLowerCase()));
    return items;
  }, [selectedMain, selectedSub, search]);

  const handlePurchase = () => {
    if (!isAuthenticated) { toast.error('Satın almak için giriş yapınız'); return; }
    toast.success(`${selectedItem?.item_name} x${purchaseCount} satın alındı!`);
    setSelectedItem(null);
    setPurchaseCount(1);
  };

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Cinzel, serif', lineHeight: '1.1' }}>
          Nesne Marketi
        </h1>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 shrink-0">
            <Card className="glass-card">
              <CardContent className="p-3 space-y-1">
                <button
                  onClick={() => { setSelectedMain(null); setSelectedSub(null); }}
                  className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                    !selectedMain ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-secondary/50'
                  }`}
                >
                  Tümü
                </button>
                {mainCategories.map((cat) => (
                  <div key={cat.id}>
                    <button
                      onClick={() => { setSelectedMain(cat.id); setSelectedSub(null); }}
                      className={`w-full flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                        selectedMain === cat.id ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-secondary/50'
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span className="flex-1">{cat.name}</span>
                      <ChevronRight className={`h-3 w-3 transition-transform ${selectedMain === cat.id ? 'rotate-90' : ''}`} />
                    </button>
                    {selectedMain === cat.id && subCategories[cat.id] && (
                      <div className="ml-5 mt-1 space-y-0.5">
                        {subCategories[cat.id].map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => setSelectedSub(sub.id)}
                            className={`w-full rounded px-2 py-1.5 text-left text-xs transition-colors ${
                              selectedSub === sub.id ? 'bg-primary/15 text-primary font-medium' : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            {sub.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="İtem ara..."
                className="pl-9 bg-card border-border"
              />
            </div>

            {/* Items Grid */}
            {filteredItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <Package className="h-12 w-12 mb-3 opacity-40" />
                <p className="text-sm">Bu kategoride ürün bulunamadı</p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {filteredItems.map((item) => (
                  <Card
                    key={item.id}
                    className="glass-card group cursor-pointer transition-all glow-gold-hover hover:border-primary/30"
                    onClick={() => setSelectedItem(item)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-secondary/60 text-2xl">
                          ⚔️
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-sm font-semibold text-foreground truncate">{item.item_name}</h3>
                            {item.popularite === 1 && <Star className="h-3 w-3 text-primary shrink-0" />}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{item.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="flex items-center gap-1 text-sm font-bold text-primary">
                              <Coins className="h-3.5 w-3.5" />
                              {item.coins} DC
                            </span>
                            {item.discount_status === 1 && item.coins_old > 0 && (
                              <span className="text-xs text-muted-foreground line-through">{item.coins_old} DC</span>
                            )}
                            {item.discount_status === 1 && (
                              <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                                -{Math.round(((item.coins_old - item.coins) / item.coins_old) * 100)}%
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Item Detail Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="glass-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Cinzel, serif' }}>{selectedItem?.item_name}</DialogTitle>
            <DialogDescription>{selectedItem?.description}</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="flex items-center justify-center rounded-lg bg-secondary/40 py-8 text-5xl">⚔️</div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Fiyat</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-primary">{selectedItem.coins} DC</span>
                  {selectedItem.discount_status === 1 && (
                    <span className="text-sm text-muted-foreground line-through">{selectedItem.coins_old} DC</span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Satın Alınma</span>
                <span className="text-sm text-foreground tabular-nums">{selectedItem.buy_count.toLocaleString()} kez</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Adet</span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPurchaseCount(Math.max(1, purchaseCount - 1))}>-</Button>
                  <span className="w-8 text-center text-sm font-semibold tabular-nums">{purchaseCount}</span>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPurchaseCount(purchaseCount + 1)}>+</Button>
                </div>
                <span className="ml-auto text-sm font-bold text-primary tabular-nums">{selectedItem.coins * purchaseCount} DC</span>
              </div>
              <Button className="w-full active:scale-[0.97] transition-transform" onClick={handlePurchase}>
                <ShoppingCart className="h-4 w-4" />
                Satın Al
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
