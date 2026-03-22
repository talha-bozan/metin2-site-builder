import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { BookOpen, Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { adminApi } from '@/api/admin';
import { toast } from 'sonner';

const defaultForm = { title: '', content: '', image: '', item_drops: '', type: 'monster', seo_title: '', seo_description: '' };

export default function WikiAdmin() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ ...defaultForm });
  const [editId, setEditId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchEntries = async () => {
    setLoading(true);
    const res = await adminApi.getWikiEntries();
    if (res.success && res.data) setEntries(Array.isArray(res.data) ? res.data : res.data.data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchEntries(); }, []);

  const resetForm = () => { setForm({ ...defaultForm }); setEditId(null); };

  const handleSubmit = async () => {
    if (!form.title.trim()) { toast.error('Baslik giriniz'); return; }
    setSubmitting(true);
    const res = editId
      ? await adminApi.updateWiki(editId, form)
      : await adminApi.createWiki(form);
    if (res.success) {
      toast.success(editId ? 'Guncellendi' : 'Eklendi');
      resetForm();
      setDialogOpen(false);
      fetchEntries();
    } else {
      toast.error(res.error || 'Hata olustu');
    }
    setSubmitting(false);
  };

  const handleEdit = (entry: any) => {
    setForm({
      title: entry.title || '',
      content: entry.content || '',
      image: entry.image || '',
      item_drops: entry.item_drops || '',
      type: entry.type || 'monster',
      seo_title: entry.seo_title || '',
      seo_description: entry.seo_description || '',
    });
    setEditId(entry.id);
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    const res = await adminApi.deleteWiki(id);
    if (res.success) {
      toast.success('Silindi');
      fetchEntries();
    } else {
      toast.error(res.error || 'Hata olustu');
    }
  };

  const updateForm = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }));

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'Cinzel, serif' }}>Wiki Yonetimi</h1>
        <Button onClick={() => { resetForm(); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Yeni Kayit
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editId ? 'Wiki Duzenle' : 'Yeni Wiki Kaydi'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Baslik</Label>
                <Input value={form.title} onChange={e => updateForm('title', e.target.value)} placeholder="Baslik" />
              </div>
              <div className="space-y-2">
                <Label>Tip</Label>
                <Select value={form.type} onValueChange={v => updateForm('type', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monster">Canavar</SelectItem>
                    <SelectItem value="item">Item</SelectItem>
                    <SelectItem value="map">Harita</SelectItem>
                    <SelectItem value="quest">Gorev</SelectItem>
                    <SelectItem value="guide">Rehber</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Gorsel URL</Label>
              <Input value={form.image} onChange={e => updateForm('image', e.target.value)} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label>Icerik</Label>
              <Textarea value={form.content} onChange={e => updateForm('content', e.target.value)} placeholder="Wiki icerigi..." rows={6} />
            </div>
            <div className="space-y-2">
              <Label>Item Dusurumleri</Label>
              <Textarea value={form.item_drops} onChange={e => updateForm('item_drops', e.target.value)} placeholder="Item listesi (JSON veya virgul ile ayrilmis)" rows={3} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>SEO Baslik</Label>
                <Input value={form.seo_title} onChange={e => updateForm('seo_title', e.target.value)} placeholder="SEO baslik" />
              </div>
              <div className="space-y-2">
                <Label>SEO Aciklama</Label>
                <Input value={form.seo_description} onChange={e => updateForm('seo_description', e.target.value)} placeholder="SEO aciklama" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Iptal</Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {editId ? 'Guncelle' : 'Ekle'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="glass-card">
        <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5" /> Wiki Kayitlari</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : entries.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Kayit bulunamadi</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Baslik</TableHead>
                  <TableHead>Tip</TableHead>
                  <TableHead>Gorsel</TableHead>
                  <TableHead className="text-right">Islemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((e: any) => (
                  <TableRow key={e.id}>
                    <TableCell>{e.id}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{e.title}</TableCell>
                    <TableCell>{e.type}</TableCell>
                    <TableCell>{e.image ? <img src={e.image} alt="" className="h-8 w-8 rounded object-cover" /> : '-'}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(e)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(e.id)}>
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
