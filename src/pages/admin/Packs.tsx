import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Boxes, Plus, Trash2, Loader2, Download, HardDrive } from 'lucide-react';
import { adminApi } from '@/api/admin';
import { toast } from 'sonner';

export default function Packs() {
  const [packs, setPacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [size, setSize] = useState('');
  const [url, setUrl] = useState('');
  const [image, setImage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchPacks = async () => {
    setLoading(true);
    const res = await adminApi.getPacks();
    if (res.success && res.data) setPacks(Array.isArray(res.data) ? res.data : res.data.data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchPacks(); }, []);

  const handleCreate = async () => {
    if (!name.trim() || !url.trim()) { toast.error('Paket adi ve indirme linki giriniz'); return; }
    setSubmitting(true);
    const res = await adminApi.createPack({ name, size, url, image, status: 1 });
    if (res.success) {
      toast.success('Paket eklendi');
      setName(''); setSize(''); setUrl(''); setImage('');
      fetchPacks();
    } else {
      toast.error(res.error || 'Hata olustu');
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu paketi silmek istediginize emin misiniz?')) return;
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
      <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Cinzel, serif' }}>Indirme Paketleri</h1>

      <Card className="glass-card mb-6">
        <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="h-5 w-5" /> Yeni Paket</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Paket Adi</Label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Full Client" />
              </div>
              <div className="space-y-2">
                <Label>Boyut</Label>
                <Input value={size} onChange={e => setSize(e.target.value)} placeholder="3.2 GB" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Indirme Linki (URL)</Label>
              <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://drive.google.com/..." />
            </div>
            <div className="space-y-2">
              <Label>Gorsel URL (opsiyonel)</Label>
              <Input value={image} onChange={e => setImage(e.target.value)} placeholder="https://..." />
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
                  <TableHead>Boyut</TableHead>
                  <TableHead>Link</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead className="text-right">Islem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packs.map((p: any) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.id}</TableCell>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <HardDrive className="h-3.5 w-3.5" />
                        {p.size || '-'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {p.url ? (
                        <a href={p.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline text-sm">
                          <Download className="h-3.5 w-3.5" />
                          Indir
                        </a>
                      ) : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={p.status === 1 ? 'default' : 'secondary'}>
                        {p.status === 1 ? 'Aktif' : 'Pasif'}
                      </Badge>
                    </TableCell>
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
