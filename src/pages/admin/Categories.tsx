import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tag, Plus, Trash2, Loader2 } from 'lucide-react';
import { adminApi } from '@/api/admin';
import { toast } from 'sonner';

export default function Categories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [mainmenu, setMainmenu] = useState(false);
  const [owner, setOwner] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    const res = await adminApi.getCategories();
    if (res.success && res.data) setCategories(Array.isArray(res.data) ? res.data : res.data.data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleAdd = async () => {
    if (!name.trim()) { toast.error('Kategori adi giriniz'); return; }
    setSubmitting(true);
    const res = await adminApi.addCategory({ name, mainmenu: mainmenu ? 1 : 0, owner });
    if (res.success) {
      toast.success('Kategori eklendi');
      setName(''); setMainmenu(false); setOwner('');
      fetchCategories();
    } else {
      toast.error(res.error || 'Hata olustu');
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: number) => {
    const res = await adminApi.deleteCategory(id);
    if (res.success) {
      toast.success('Kategori silindi');
      fetchCategories();
    } else {
      toast.error(res.error || 'Hata olustu');
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Cinzel, serif' }}>Kategoriler</h1>

      <Card className="glass-card mb-6">
        <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="h-5 w-5" /> Yeni Kategori</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label>Kategori Adi</Label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="Kategori adi" />
            </div>
            <div className="space-y-2">
              <Label>Sahip</Label>
              <Input value={owner} onChange={e => setOwner(e.target.value)} placeholder="Sahip (opsiyonel)" />
            </div>
            <div className="flex items-end gap-2 pb-1">
              <div className="flex items-center gap-2">
                <Checkbox id="mainmenu" checked={mainmenu} onCheckedChange={(v) => setMainmenu(!!v)} />
                <Label htmlFor="mainmenu">Ana Menu</Label>
              </div>
            </div>
            <div className="flex items-end">
              <Button onClick={handleAdd} disabled={submitting} className="w-full">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                Ekle
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader><CardTitle className="flex items-center gap-2"><Tag className="h-5 w-5" /> Kategoriler</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : categories.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Kategori bulunamadi</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Ad</TableHead>
                  <TableHead>Ana Menu</TableHead>
                  <TableHead>Sahip</TableHead>
                  <TableHead className="text-right">Islem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((cat: any) => (
                  <TableRow key={cat.id}>
                    <TableCell>{cat.id}</TableCell>
                    <TableCell>{cat.name}</TableCell>
                    <TableCell>{cat.mainmenu ? 'Evet' : 'Hayir'}</TableCell>
                    <TableCell>{cat.owner || '-'}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(cat.id)}>
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
