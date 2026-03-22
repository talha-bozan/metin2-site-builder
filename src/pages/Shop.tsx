import { useState, useEffect, useMemo } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Search, ShoppingCart, ChevronRight, ChevronLeft, Star, Coins, Package, Loader2, Flame, Percent, Sparkles, Zap, Shield, Swords } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { shopApi, ShopCategory, ShopItem } from '@/api/shop';

/* Metin2 APPLY_TYPES - bonus type names */
const APPLY_NAMES: Record<number, string> = {
  1:"HP", 2:"SP", 3:"Yasam Enerjisi", 4:"Zeka", 5:"Güç", 6:"Çeviklik",
  7:"Saldırı Hızı", 8:"Hareket Hızı", 9:"Büyü Hızı", 10:"HP Üretimi", 11:"SP Üretimi",
  12:"Zehirleme", 13:"Sersemletme %", 14:"Yavaşlatma %", 15:"Kritik Vuruş %",
  16:"Delici Vuruş %", 17:"İnsanlara Güçlü", 18:"Hayvanlara Güçlü",
  19:"Oklara Güçlü", 20:"Mistiklere Güçlü", 21:"Ölümsüzlere Güçlü",
  22:"Şeytanlara Güçlü", 23:"HP Emilim", 24:"SP Emilim",
  25:"SP Çalma %", 26:"SP Geri Kazanma", 27:"Beden Bloklama",
  28:"Oktan Korunma %", 29:"Kılıç Savunma", 30:"Çift El Savunma",
  31:"Bıçak Savunma", 32:"Can Savunma", 33:"Yelpaze Savunma",
  34:"Oka Dayanıklılık", 35:"Ateşe Dayanıklılık", 36:"Şimşeğe Dayanıklılık",
  37:"Büyüye Dayanıklılık", 38:"Rüzgar Dayanıklılık", 39:"Darbe Yansıtma",
  40:"Lanet Yansıtma", 41:"Zehire Direnç", 43:"EXP Bonus",
  44:"2x Yang Düşme", 45:"2x Eşya Düşme", 46:"İksir Etkisi",
  47:"HP Yükselmesi", 48:"Sersemlik Bağışıklık", 49:"Yavaşlama Bağışıklık",
  50:"Düşme Bağışıklık", 53:"Saldırı Değeri", 54:"Savunma",
  55:"Büyülü Saldırı", 56:"Büyü Savunması", 59:"Savaşçılara Güçlü",
  60:"Ninjalara Güçlü", 61:"Suralara Güçlü", 62:"Şamanlara Güçlü",
  63:"Yartıklara Güçlü", 64:"Saldırı Değeri", 65:"Savunma",
  71:"Beceri Hasarı", 72:"Ortalama Zarar", 73:"Beceri Hasarına Direnç",
  74:"Ortalama Zarara Direnç", 77:"Eşya Ele Geçirme %",
};

/* Extract item attributes as readable list */
function getItemAttrs(item: ShopItem): { name: string; value: number }[] {
  const attrs: { name: string; value: number }[] = [];
  for (let i = 0; i <= 6; i++) {
    const type = (item as any)[`attrtype${i}`] || 0;
    const value = (item as any)[`attrvalue${i}`] || 0;
    if (type > 0 && value !== 0) {
      attrs.push({ name: APPLY_NAMES[type] || `Bonus ${type}`, value });
    }
  }
  return attrs;
}

/* Extract sockets */
function getItemSockets(item: ShopItem): number[] {
  const sockets: number[] = [];
  for (let i = 0; i <= 2; i++) {
    const val = (item as any)[`socket${i}`] || 0;
    if (val > 0) sockets.push(val);
  }
  return sockets;
}

export default function Shop() {
  const { isAuthenticated, user, refreshProfile } = useAuth();
  const [categories, setCategories] = useState<ShopCategory[]>([]);
  const [items, setItems] = useState<ShopItem[]>([]);
  const [selectedMain, setSelectedMain] = useState<number | null>(null);
  const [selectedSub, setSelectedSub] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [purchaseCount, setPurchaseCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'popular' | 'discount'>('all');

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

  const mainCategories = useMemo(() => categories.filter(c => c.mainmenu === 0 || (!c.mainmenu && !c.owner)), [categories]);
  const subCategories = useMemo(() => {
    const map: Record<number, ShopCategory[]> = {};
    categories.forEach(c => {
      if (c.children && c.children.length > 0) {
        map[c.id] = c.children;
      }
    });
    return map;
  }, [categories]);

  const popularItems = useMemo(() => items.filter(i => i.popularite === 1), [items]);
  const discountItems = useMemo(() => items.filter(i => i.discount_status === 1 && i.coins_old > 0), [items]);

  const filteredItems = useMemo(() => {
    let filtered = items;

    if (activeTab === 'popular') {
      filtered = popularItems;
    } else if (activeTab === 'discount') {
      filtered = discountItems;
    }

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
  }, [selectedMain, selectedSub, search, items, subCategories, activeTab, popularItems, discountItems]);

  // Pagination
  const ITEMS_PER_PAGE = 24;
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredItems, currentPage]);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);

  useEffect(() => { setCurrentPage(1); }, [selectedMain, selectedSub, search, activeTab]);

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
      refreshProfile();
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

  const selectedAttrs = selectedItem ? getItemAttrs(selectedItem) : [];
  const selectedSockets = selectedItem ? getItemSockets(selectedItem) : [];

  return (
    <Layout>
      {/* Hero Header */}
      <div className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjEiIGZpbGw9ImhzbGEoNDAsMjAlLDUwJSwwLjA3KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNnKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')] opacity-60" />
        <div className="relative mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-wide" style={{ fontFamily: 'Cinzel, serif', lineHeight: '1.1' }}>
                <span className="text-gold">Nesne</span> Marketi
              </h1>
              <p className="text-sm text-muted-foreground mt-1">{items.length} urun mevcut</p>
            </div>
            {isAuthenticated && (
              <div className="flex items-center gap-2 rounded-lg bg-card/80 border border-border px-4 py-2.5 backdrop-blur-sm">
                <Coins className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Bakiyeniz</p>
                  <p className="text-lg font-bold text-primary tabular-nums leading-none">{(user?.coins ?? 0).toLocaleString()} DC</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Sidebar */}
          <aside className="w-full lg:w-60 shrink-0 space-y-4">
            {/* Category Nav */}
            <div className="rounded-lg border border-border bg-card/60 overflow-hidden">
              <div className="px-4 py-3 border-b border-border/60 bg-secondary/30">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Kategoriler</h3>
              </div>
              <div className="p-2 space-y-0.5">
                <button
                  onClick={() => { setSelectedMain(null); setSelectedSub(null); setActiveTab('all'); }}
                  className={`w-full rounded-md px-3 py-2 text-left text-sm transition-all ${
                    !selectedMain && activeTab === 'all'
                      ? 'bg-primary/15 text-primary font-medium border border-primary/20'
                      : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                  }`}
                >
                  Tum Urunler
                </button>
                {mainCategories.map((cat) => (
                  <div key={cat.id}>
                    <button
                      onClick={() => { setSelectedMain(cat.id); setSelectedSub(null); setActiveTab('all'); }}
                      className={`w-full flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-all ${
                        selectedMain === cat.id
                          ? 'bg-primary/15 text-primary font-medium border border-primary/20'
                          : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                      }`}
                    >
                      <span className="flex-1 truncate">{cat.name}</span>
                      {subCategories[cat.id]?.length > 0 && (
                        <ChevronRight className={`h-3.5 w-3.5 transition-transform shrink-0 ${selectedMain === cat.id ? 'rotate-90' : ''}`} />
                      )}
                    </button>
                    {selectedMain === cat.id && subCategories[cat.id] && (
                      <div className="ml-3 mt-1 space-y-0.5 border-l-2 border-primary/20 pl-3">
                        {subCategories[cat.id].map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => setSelectedSub(sub.id)}
                            className={`w-full rounded px-2 py-1.5 text-left text-xs transition-all ${
                              selectedSub === sub.id
                                ? 'bg-primary/10 text-primary font-medium'
                                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'
                            }`}
                          >
                            {sub.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Filters */}
            <div className="rounded-lg border border-border bg-card/60 overflow-hidden">
              <div className="px-4 py-3 border-b border-border/60 bg-secondary/30">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Filtreler</h3>
              </div>
              <div className="p-2 space-y-0.5">
                <button
                  onClick={() => { setActiveTab('popular'); setSelectedMain(null); setSelectedSub(null); }}
                  className={`w-full flex items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-sm transition-all ${
                    activeTab === 'popular'
                      ? 'bg-amber-500/15 text-amber-400 font-medium border border-amber-500/20'
                      : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                  }`}
                >
                  <Flame className="h-4 w-4 text-amber-500" />
                  <span>Populer Urunler</span>
                  <Badge variant="secondary" className="ml-auto text-[10px] px-1.5">{popularItems.length}</Badge>
                </button>
                <button
                  onClick={() => { setActiveTab('discount'); setSelectedMain(null); setSelectedSub(null); }}
                  className={`w-full flex items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-sm transition-all ${
                    activeTab === 'discount'
                      ? 'bg-red-500/15 text-red-400 font-medium border border-red-500/20'
                      : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                  }`}
                >
                  <Percent className="h-4 w-4 text-red-500" />
                  <span>Indirimli Urunler</span>
                  <Badge variant="secondary" className="ml-auto text-[10px] px-1.5">{discountItems.length}</Badge>
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Item adi ile ara..."
                className="pl-10 h-11 bg-card/80 border-border text-sm"
              />
            </div>

            {/* Active filter indicator */}
            {(activeTab !== 'all' || selectedMain) && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Filtre:</span>
                {activeTab === 'popular' && (
                  <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 gap-1">
                    <Flame className="h-3 w-3" /> Populer
                  </Badge>
                )}
                {activeTab === 'discount' && (
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30 gap-1">
                    <Percent className="h-3 w-3" /> Indirimli
                  </Badge>
                )}
                {selectedMain && (
                  <Badge variant="secondary">
                    {mainCategories.find(c => c.id === selectedMain)?.name}
                    {selectedSub && ` > ${subCategories[selectedMain]?.find(s => s.id === selectedSub)?.name}`}
                  </Badge>
                )}
                <span className="text-muted-foreground ml-1">({filteredItems.length} urun)</span>
                <button
                  onClick={() => { setActiveTab('all'); setSelectedMain(null); setSelectedSub(null); setSearch(''); }}
                  className="text-xs text-primary hover:underline ml-auto"
                >
                  Temizle
                </button>
              </div>
            )}

            {/* Featured Popular Row (only on "all" tab with no filters) */}
            {activeTab === 'all' && !selectedMain && !search && popularItems.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-amber-500" />
                  <h2 className="text-sm font-semibold text-foreground">Populer Urunler</h2>
                  <div className="flex-1 h-px bg-border/50" />
                  <button
                    onClick={() => { setActiveTab('popular'); setSelectedMain(null); setSelectedSub(null); }}
                    className="text-xs text-primary hover:underline"
                  >
                    Tumunu Gor
                  </button>
                </div>
                <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 xl:grid-cols-4">
                  {popularItems.slice(0, 4).map((item) => (
                    <ItemCard key={`pop-${item.id}`} item={item} onClick={() => setSelectedItem(item)} featured />
                  ))}
                </div>
              </div>
            )}

            {/* Featured Discount Row (only on "all" tab with no filters) */}
            {activeTab === 'all' && !selectedMain && !search && discountItems.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Percent className="h-4 w-4 text-red-500" />
                  <h2 className="text-sm font-semibold text-foreground">Indirimli Urunler</h2>
                  <div className="flex-1 h-px bg-border/50" />
                  <button
                    onClick={() => { setActiveTab('discount'); setSelectedMain(null); setSelectedSub(null); }}
                    className="text-xs text-primary hover:underline"
                  >
                    Tumunu Gor
                  </button>
                </div>
                <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 xl:grid-cols-4">
                  {discountItems.slice(0, 4).map((item) => (
                    <ItemCard key={`disc-${item.id}`} item={item} onClick={() => setSelectedItem(item)} discount />
                  ))}
                </div>
              </div>
            )}

            {/* Separator if featured sections exist */}
            {activeTab === 'all' && !selectedMain && !search && (popularItems.length > 0 || discountItems.length > 0) && (
              <div className="flex items-center gap-2 pt-2">
                <Sparkles className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold text-foreground">Tum Urunler</h2>
                <div className="flex-1 h-px bg-border/50" />
              </div>
            )}

            {/* Items Grid */}
            {filteredItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <Package className="h-14 w-14 mb-3 opacity-30" />
                <p className="text-sm font-medium">Bu kategoride urun bulunamadi</p>
                <p className="text-xs mt-1">Baska bir kategori veya filtre deneyin</p>
              </div>
            ) : (
              <>
                <div className="grid gap-3 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {paginatedItems.map((item) => (
                    <ItemCard key={item.id} item={item} onClick={() => setSelectedItem(item)} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-6 pb-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="gap-1 border-border"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="hidden sm:inline">Onceki</span>
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
                        .reduce<(number | string)[]>((acc, p, i, arr) => {
                          if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('...');
                          acc.push(p);
                          return acc;
                        }, [])
                        .map((p, i) =>
                          typeof p === 'string' ? (
                            <span key={`dots-${i}`} className="px-1 text-muted-foreground text-sm">...</span>
                          ) : (
                            <Button
                              key={p}
                              variant={currentPage === p ? 'default' : 'outline'}
                              size="sm"
                              className={`h-8 w-8 p-0 ${currentPage === p ? '' : 'border-border'}`}
                              onClick={() => setCurrentPage(p)}
                            >
                              {p}
                            </Button>
                          )
                        )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="gap-1 border-border"
                    >
                      <span className="hidden sm:inline">Sonraki</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Item Detail Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => { if (!open) { setSelectedItem(null); setPurchaseCount(1); } }}>
        <DialogContent className="border-border max-w-lg bg-card max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2" style={{ fontFamily: 'Cinzel, serif' }}>
              {selectedItem?.item_name}
              {selectedItem?.popularite === 1 && <Star className="h-4 w-4 text-amber-500 fill-amber-500" />}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">VNUM: {selectedItem?.vnum}</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              {/* Image */}
              <div className="relative flex items-center justify-center rounded-lg bg-gradient-to-b from-secondary/60 to-secondary/20 border border-border/50 py-8">
                {selectedItem.discount_status === 1 && selectedItem.coins_old > 0 && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="destructive" className="text-xs font-bold px-2">
                      -{Math.round(((selectedItem.coins_old - selectedItem.coins) / selectedItem.coins_old) * 100)}%
                    </Badge>
                  </div>
                )}
                {selectedItem.item_image ? (
                  <img src={selectedItem.item_image} alt={selectedItem.item_name} className="h-20 w-20 object-contain drop-shadow-lg" />
                ) : (
                  <span className="text-5xl">⚔️</span>
                )}
              </div>

              {/* Price */}
              <div className="flex items-center justify-between rounded-md bg-secondary/30 px-4 py-3">
                <span className="text-sm text-muted-foreground font-medium">Fiyat</span>
                <div className="flex items-center gap-2">
                  {selectedItem.discount_status === 1 && selectedItem.coins_old > 0 && (
                    <span className="text-sm text-muted-foreground line-through">{selectedItem.coins_old.toLocaleString()} DC</span>
                  )}
                  <span className="text-xl font-bold text-primary tabular-nums">{selectedItem.coins.toLocaleString()} DC</span>
                </div>
              </div>

              {/* Attributes / Bonuses */}
              {selectedAttrs.length > 0 && (
                <div className="rounded-md border border-primary/20 bg-primary/5 overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-2 border-b border-primary/10 bg-primary/10">
                    <Zap className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">Efsunlar</span>
                  </div>
                  <div className="divide-y divide-border/30">
                    {selectedAttrs.map((attr, i) => (
                      <div key={i} className="flex items-center justify-between px-4 py-2">
                        <span className="text-sm text-foreground/90">{attr.name}</span>
                        <span className="text-sm font-bold text-emerald-400 tabular-nums">+{attr.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sockets */}
              {selectedSockets.length > 0 && (
                <div className="rounded-md border border-blue-500/20 bg-blue-500/5 overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-2 border-b border-blue-500/10 bg-blue-500/10">
                    <Shield className="h-3.5 w-3.5 text-blue-400" />
                    <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Yuvalar (Socket)</span>
                  </div>
                  <div className="px-4 py-2 flex gap-3">
                    {selectedSockets.map((s, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-blue-400" />
                        <span className="text-sm text-foreground/80 tabular-nums">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {selectedItem.description && selectedItem.description !== 'Bu eşya size fayda sağlayacaktır.' && (
                <div className="rounded-md bg-secondary/20 px-4 py-3">
                  <p className="text-xs text-muted-foreground">{selectedItem.description}</p>
                </div>
              )}

              {/* Quantity */}
              <div className="flex items-center justify-between rounded-md bg-secondary/30 px-4 py-3">
                <span className="text-sm text-muted-foreground font-medium">Adet</span>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="icon" className="h-8 w-8 border-border" onClick={() => setPurchaseCount(Math.max(1, purchaseCount - 1))}>-</Button>
                  <span className="w-8 text-center font-bold tabular-nums">{purchaseCount}</span>
                  <Button variant="outline" size="icon" className="h-8 w-8 border-border" onClick={() => setPurchaseCount(purchaseCount + 1)}>+</Button>
                  <div className="w-px h-6 bg-border mx-1" />
                  <span className="text-sm font-bold text-primary tabular-nums">{(selectedItem.coins * purchaseCount).toLocaleString()} DC</span>
                </div>
              </div>

              {/* Buy Button */}
              <Button
                className="w-full h-11 text-sm font-semibold active:scale-[0.97] transition-transform gap-2"
                onClick={handlePurchase}
                disabled={purchasing}
              >
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

/* Item Card Component */
function ItemCard({ item, onClick, featured, discount }: { item: ShopItem; onClick: () => void; featured?: boolean; discount?: boolean }) {
  const hasDiscount = item.discount_status === 1 && item.coins_old > 0;
  const discountPercent = hasDiscount ? Math.round(((item.coins_old - item.coins) / item.coins_old) * 100) : 0;
  const attrs = getItemAttrs(item);

  return (
    <div
      className={`group relative rounded-lg border bg-card/80 cursor-pointer transition-all duration-200 hover:border-primary/40 hover:shadow-[0_0_20px_-5px_hsla(40,45%,55%,0.25)] overflow-hidden ${
        featured ? 'border-amber-500/20' : discount ? 'border-red-500/20' : 'border-border/60'
      }`}
      onClick={onClick}
    >
      {/* Discount Badge */}
      {hasDiscount && (
        <div className="absolute top-2 right-2 z-10">
          <Badge variant="destructive" className="text-[10px] font-bold px-1.5 py-0 shadow-md">
            -{discountPercent}%
          </Badge>
        </div>
      )}

      {/* Popular Badge */}
      {item.popularite === 1 && (
        <div className="absolute top-2 left-2 z-10">
          <div className="flex items-center gap-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 px-1.5 py-0.5">
            <Star className="h-2.5 w-2.5 text-amber-500 fill-amber-500" />
            <span className="text-[9px] font-semibold text-amber-400">HIT</span>
          </div>
        </div>
      )}

      {/* Image Area */}
      <div className="flex items-center justify-center h-24 bg-gradient-to-b from-secondary/40 to-transparent pt-2">
        {item.item_image ? (
          <img
            src={item.item_image}
            alt={item.item_name}
            className="h-16 w-16 object-contain transition-transform duration-200 group-hover:scale-110 drop-shadow-md"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        ) : (
          <span className="text-3xl opacity-60">⚔️</span>
        )}
      </div>

      {/* Info */}
      <div className="px-3 pb-3 pt-1 space-y-1.5">
        <h3 className="text-xs font-semibold text-foreground truncate leading-tight">{item.item_name}</h3>

        {/* Attribute preview - show top 2 attrs */}
        {attrs.length > 0 && (
          <div className="space-y-0.5">
            {attrs.slice(0, 2).map((attr, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground truncate mr-1">{attr.name}</span>
                <span className="text-[10px] font-semibold text-emerald-400 tabular-nums shrink-0">+{attr.value}</span>
              </div>
            ))}
            {attrs.length > 2 && (
              <span className="text-[9px] text-primary/70">+{attrs.length - 2} efsun daha</span>
            )}
          </div>
        )}

        <div className="flex items-center gap-1.5 pt-0.5">
          <span className="flex items-center gap-0.5 text-sm font-bold text-primary tabular-nums">
            <Coins className="h-3 w-3" />
            {item.coins.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-[10px] text-muted-foreground line-through tabular-nums">{item.coins_old.toLocaleString()}</span>
          )}
        </div>
      </div>
    </div>
  );
}
