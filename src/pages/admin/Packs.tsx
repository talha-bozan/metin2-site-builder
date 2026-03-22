import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Boxes, Plus, Trash2, Loader2 } from 'lucide-react';
import { adminApi } from '@/api/admin';
import { toast } from 'sonner';

export default function Packs() {
  const [packs, setPacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [items, setItems] = useState('');
  const [price, setPrice] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchPacks = async () => {
    setLoading(true);
    const res = await adminApi.getPacks();
    if (res.success && res.data) setPacks(Array.isArray(res.data) ? res.data : res.data.data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchPacks(); }, []);

  const handleCreate = async () => {
    if (!name.trim() || !price) { toast.error('Paket adi ve fiyat giriniz'); return; }
    setSubmitting(true);
    const res = await adminApi.createPack({ name, items, price: Number(price) });
    if (res.success) {
      toast.success('Paket eklendi');
      setName(''); setItems(''); setPrice('');
      fetchPacks();
    } else {
      toast.error(res.error || 'Hata olustu');
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: number) => {
    const res = await adminApi.deletePack(id);
    if (res.success) {
      toast.success('Paket silindi');
      fetchPacks();
    } else {
      toast.error(res.error || 'Hata olustu');
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Cinzel, serif' }}>Paketler</h1>

      <Card className="glass-card mb-6">
        <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="h-5 w-5" /> Yeni Paket</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Paket Adi</Label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Paket adi" />
              </div>
              <div className="space-y-2">
                <Label>Fiyat (EP)</Label>
                <Input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="100" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Icerik (Item listesi)</Label>
              <Textarea value={items} onChange={e => setItems(e.target.value)} placeholder="Item listesini giriniz..." rows={3} />
            </div>
            <Button onClick={handleCreate} disabled={submitting} className="w-fit">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              Paket Ekle
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader><CardTitle className="flex items-center gap-2"><Boxes className="h-5 w-5" /> Paketler</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : packs.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Paket bulunamadi</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Ad</TableHead>
                  <TableHead>Icerik</TableHead>
                  <TableHead>Fiyat</TableHead>
                  <TableHead className="text-right">Islem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packs.map((p: any) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.id}</TableCell>
                    <TableCell>{p.name}</TableCell>
                    <TableCell className="max-w-[300px] truncate">{p.items}</TableCell>
                    <TableCell>{p.price} EP</TableCell>
                    <TableCell className="text-right">
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(p.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
