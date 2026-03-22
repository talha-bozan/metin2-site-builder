import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Newspaper, Plus, Trash2, Loader2 } from 'lucide-react';
import { adminApi } from '@/api/admin';
import { toast } from 'sonner';

export default function News() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchNews = async () => {
    setLoading(true);
    const res = await adminApi.getNews();
    if (res.success && res.data) setNews(Array.isArray(res.data) ? res.data : res.data.data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchNews(); }, []);

  const handleCreate = async () => {
    if (!title.trim() || !content.trim()) { toast.error('Baslik ve icerik giriniz'); return; }
    setSubmitting(true);
    const res = await adminApi.createNews({ title, content, image });
    if (res.success) {
      toast.success('Haber eklendi');
      setTitle(''); setContent(''); setImage('');
      fetchNews();
    } else {
      toast.error(res.error || 'Hata olustu');
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: number) => {
    const res = await adminApi.deleteNews(id);
    if (res.success) {
      toast.success('Haber silindi');
      fetchNews();
    } else {
      toast.error(res.error || 'Hata olustu');
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Cinzel, serif' }}>Haberler</h1>

      <Card className="glass-card mb-6">
        <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="h-5 w-5" /> Yeni Haber</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Baslik</Label>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Haber basligi" />
              </div>
              <div className="space-y-2">
                <Label>Gorsel URL</Label>
                <Input value={image} onChange={e => setImage(e.target.value)} placeholder="https://..." />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Icerik</Label>
              <Textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Haber icerigi..." rows={4} />
            </div>
            <Button onClick={handleCreate} disabled={submitting} className="w-fit">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              Haber Ekle
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader><CardTitle className="flex items-center gap-2"><Newspaper className="h-5 w-5" /> Haberler</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : news.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Haber bulunamadi</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Baslik</TableHead>
                  <TableHead>Gorsel</TableHead>
                  <TableHead>Tarih</TableHead>
                  <TableHead className="text-right">Islem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {news.map((n: any) => (
                  <TableRow key={n.id}>
                    <TableCell>{n.id}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{n.title}</TableCell>
                    <TableCell>{n.image ? <img src={n.image} alt="" className="h-8 w-8 rounded object-cover" /> : '-'}</TableCell>
                    <TableCell>{n.created_at || '-'}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(n.id)}>
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
