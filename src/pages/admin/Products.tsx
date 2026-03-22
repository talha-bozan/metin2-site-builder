import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminApi } from '@/api/admin';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose,
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Loader2, Package, Coins, Star, Tag } from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  id: number;
  vnum: number;
  item_name: string;
  coins: number;
  coins_old: number;
  kategori_id: number;
  description: string;
  item_image: string;
  count_1: number;
  discount_status: number;
  popularite: number;
}

const emptyForm = {
  vnum: '',
  item_name: '',
  coins: '',
  kategori_id: '',
  description: '',
  item_image: '',
  count_1: '1',
  discount_status: 0,
  coins_old: '',
  popularite: 0,
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    const res = await adminApi.getProducts();
    if (res.success && res.data) {
      setProducts(Array.isArray(res.data) ? res.data : res.data.products ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const openAdd = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      vnum: String(p.vnum),
      item_name: p.item_name,
      coins: String(p.coins),
      kategori_id: String(p.kategori_id),
      description: p.description ?? '',
      item_image: p.item_image ?? '',
      count_1: String(p.count_1 ?? 1),
      discount_status: p.discount_status ?? 0,
      coins_old: String(p.coins_old ?? ''),
      popularite: p.popularite ?? 0,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.item_name || !form.coins || !form.vnum) {
      toast.error('Vnum, urun adi ve coin alanlari zorunludur.');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        vnum: Number(form.vnum),
        item_name: form.item_name,
        coins: Number(form.coins),
        kategori_id: Number(form.kategori_id),
        description: form.description,
        item_image: form.item_image,
        count_1: Number(form.count_1),
        discount_status: form.discount_status,
        coins_old: Number(form.coins_old) || 0,
        popularite: form.popularite,
      };

      let res;
      if (editingId) {
        res = await adminApi.updateProduct(editingId, payload);
      } else {
        res = await adminApi.addProduct(payload);
      }

      if (res.success) {
        toast.success(editingId ? 'Urun guncellendi.' : 'Urun eklendi.');
        setDialogOpen(false);
        resetForm();
        fetchProducts();
      } else {
        toast.error(res.error || 'Bir hata olustu.');
      }
    } catch {
      toast.error('Bir hata olustu.');
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu urunu silmek istediginize emin misiniz?')) return;
    const res = await adminApi.deleteProduct(id);
    if (res.success) {
      toast.success('Urun silindi.');
      fetchProducts();
    } else {
      toast.error(res.error || 'Silinemedi.');
    }
  };

  const handleToggleDiscount = async (p: Product) => {
    const newStatus = p.discount_status ? 0 : 1;
    const res = await adminApi.toggleDiscount(p.id, newStatus);
    if (res.success) {
      toast.success(newStatus ? 'Indirim aktif.' : 'Indirim kapatildi.');
      setProducts(prev => prev.map(item => item.id === p.id ? { ...item, discount_status: newStatus } : item));
    } else {
      toast.error('Degistirilemedi.');
    }
  };

  const handleTogglePopular = async (p: Product) => {
    const newStatus = p.popularite ? 0 : 1;
    const res = await adminApi.togglePopular(p.id, newStatus);
    if (res.success) {
      toast.success(newStatus ? 'Populer olarak isaretlendi.' : 'Populerlik kaldirildi.');
      setProducts(prev => prev.map(item => item.id === p.id ? { ...item, popularite: newStatus } : item));
    } else {
      toast.error('Degistirilemedi.');
    }
  };

  const updateField = (field: string, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'Cinzel, serif' }}>Urunler</h1>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="h-4 w-4" /> Urun Ekle
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">Henuz urun eklenmemis.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map(p => (
            <Card key={p.id} className="glass-card overflow-hidden">
              {p.item_image && (
                <div className="h-32 bg-secondary/30 flex items-center justify-center overflow-hidden">
                  <img src={p.item_image} alt={p.item_name} className="h-full object-contain" />
                </div>
              )}
              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-foreground truncate">{p.item_name}</h3>
                  <p className="text-xs text-muted-foreground">VNUM: {p.vnum}</p>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <span className="flex items-center gap-1 text-primary font-medium">
                    <Coins className="h-3.5 w-3.5" />
                    {p.coins}
                  </span>
                  {p.discount_status === 1 && p.coins_old > 0 && (
                    <span className="text-muted-foreground line-through text-xs">{p.coins_old}</span>
                  )}
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Tag className="h-3.5 w-3.5" />
                    Kat: {p.kategori_id}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Indirim</span>
                    <Switch
                      checked={p.discount_status === 1}
                      onCheckedChange={() => handleToggleDiscount(p)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Populer</span>
                    <Switch
                      checked={p.popularite === 1}
                      onCheckedChange={() => handleTogglePopular(p)}
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => openEdit(p)}>
                    <Pencil className="h-3.5 w-3.5" /> Duzenle
                  </Button>
                  <Button variant="destructive" size="sm" className="flex-1 gap-1" onClick={() => handleDelete(p.id)}>
                    <Trash2 className="h-3.5 w-3.5" /> Sil
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Cinzel, serif' }}>
              {editingId ? 'Urun Duzenle' : 'Urun Ekle'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>VNUM</Label>
                <Input type="number" placeholder="12345" value={form.vnum} onChange={e => updateField('vnum', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Urun Adi</Label>
                <Input placeholder="Urun adi" value={form.item_name} onChange={e => updateField('item_name', e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Coin (Fiyat)</Label>
                <Input type="number" placeholder="100" value={form.coins} onChange={e => updateField('coins', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Kategori ID</Label>
                <Input type="number" placeholder="1" value={form.kategori_id} onChange={e => updateField('kategori_id', e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Aciklama</Label>
              <Textarea placeholder="Urun aciklamasi..." value={form.description} onChange={e => updateField('description', e.target.value)} rows={3} />
            </div>

            <div className="space-y-2">
              <Label>Item Gorsel URL</Label>
              <Input placeholder="https://..." value={form.item_image} onChange={e => updateField('item_image', e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Adet (count_1)</Label>
                <Input type="number" placeholder="1" value={form.count_1} onChange={e => updateField('count_1', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Eski Fiyat (coins_old)</Label>
                <Input type="number" placeholder="0" value={form.coins_old} onChange={e => updateField('coins_old', e.target.value)} />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.discount_status === 1}
                  onCheckedChange={(v) => updateField('discount_status', v ? 1 : 0)}
                />
                <Label>Indirim Aktif</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.popularite === 1}
                  onCheckedChange={(v) => updateField('popularite', v ? 1 : 0)}
                />
                <Label>Populer</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Iptal</Button>
            </DialogClose>
            <Button onClick={handleSubmit} disabled={submitting} className="gap-2">
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {editingId ? 'Guncelle' : 'Ekle'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
