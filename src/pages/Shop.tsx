import { useState, useEffect, useMemo } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Search, ShoppingCart, ChevronRight, Star, Coins, Package, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { shopApi, ShopCategory, ShopItem } from '@/api/shop';

export default function Shop() {
  const { isAuthenticated } = useAuth();
  const [categories, setCategories] = useState<ShopCategory[]>([]);
  const [items, setItems] = useState<ShopItem[]>([]);
  const [selectedMain, setSelectedMain] = useState<number | null>(null);
  const [selectedSub, setSelectedSub] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [purchaseCount, setPurchaseCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [cRes, iRes] = await Promise.all([
        shopApi.getCategories(),
        shopApi.getItems(),
      ]);
      if (cRes.success && cRes.data) setCategories(Array.isArray(cRes.data) ? cRes.data : []);
      if (iRes.success && iRes.data) setItems(Array.isArray(iRes.data) ? iRes.data : []);
      setLoading(false);
    };
    load();
  }, []);

  // Build category hierarchy
  const mainCategories = useMemo(() => categories.filter(c => c.mainmenu === 1 || !c.owner), [categories]);
  const subCategories = useMemo(() => {
    const map: Record<number, ShopCategory[]> = {};
    categories.forEach(c => {
      if (c.owner && c.owner > 0) {
        if (!map[c.owner]) map[c.owner] = [];
        map[c.owner].push(c);
      } else if (c.children) {
        map[c.id] = c.children;
      }
    });
    return map;
  }, [categories]);

  const filteredItems = useMemo(() => {
    let filtered = items;
    if (selectedSub) {
      filtered = filtered.filter((i) => i.kategori_id === selectedSub);
    } else if (selectedMain) {
      const subIds = (subCategories[selectedMain] || []).map((s) => s.id);
      filtered = filtered.filter((i) => subIds.includes(i.kategori_id) || i.kategori_id === selectedMain);
    }
    if (search) {
      filtered = filtered.filter((i) => i.item_name.toLowerCase().includes(search.toLowerCase()));
    }
    return filtered;
  }, [selectedMain, selectedSub, search, items, subCategories]);

  const handlePurchase = async () => {
    if (!isAuthenticated) { toast.error('Satin almak icin giris yapiniz'); return; }
    if (!selectedItem) return;
    setPurchasing(true);
    const res = await shopApi.purchaseItem(selectedItem.id, purchaseCount);
    setPurchasing(false);
    if (res.success) {
      toast.success(res.data?.message || `${selectedItem.item_name} x${purchaseCount} satin alindi!`);
      setSelectedItem(null);
      setPurchaseCount(1);
    } else {
      toast.error(res.error || 'Satin alma basarisiz');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

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
                  Tumu
                </button>
                {mainCategories.map((cat) => (
                  <div key={cat.id}>
                    <button
                      onClick={() => { setSelectedMain(cat.id); setSelectedSub(null); }}
                      className={`w-full flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                        selectedMain === cat.id ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-secondary/50'
                      }`}
                    >
                      <span className="flex-1">{cat.name}</span>
                      {subCategories[cat.id]?.length > 0 && (
                        <ChevronRight className={`h-3 w-3 transition-transform ${selectedMain === cat.id ? 'rotate-90' : ''}`} />
                      )}
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
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Item ara..."
                className="pl-9 bg-card border-border"
              />
            </div>

            {filteredItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <Package className="h-12 w-12 mb-3 opacity-40" />
                <p className="text-sm">Bu kategoride urun bulunamadi</p>
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
                          {item.item_image ? (
                            <img src={item.item_image} alt={item.item_name} className="h-12 w-12 object-contain" />
                          ) : '⚔️'}
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
                            {item.discount_status === 1 && item.coins_old > 0 && (
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
              <div className="flex items-center justify-center rounded-lg bg-secondary/40 py-8 text-5xl">
                {selectedItem.item_image ? (
                  <img src={selectedItem.item_image} alt={selectedItem.item_name} className="h-20 w-20 object-contain" />
                ) : '⚔️'}
              </div>
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
                <span className="text-sm text-muted-foreground">Satin Alinma</span>
                <span className="text-sm text-foreground tabular-nums">{(selectedItem.buy_count || 0).toLocaleString()} kez</span>
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
              <Button className="w-full active:scale-[0.97] transition-transform" onClick={handlePurchase} disabled={purchasing}>
                {purchasing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingCart className="h-4 w-4" />}
                Satin Al
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
