import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Calendar, Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { adminApi } from '@/api/admin';
import { toast } from 'sonner';

export default function Events() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ day: '', name: '', start_time: '', end_time: '' });
  const [submitting, setSubmitting] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    const res = await adminApi.getEvents();
    if (res.success && res.data) setEvents(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchEvents(); }, []);

  const resetForm = () => { setForm({ day: '', name: '', start_time: '', end_time: '' }); setEditId(null); };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.day.trim()) { toast.error('Gun ve etkinlik adi giriniz'); return; }
    setSubmitting(true);
    const res = editId
      ? await adminApi.updateEvent(editId, form)
      : await adminApi.createEvent(form);
    if (res.success) {
      toast.success(editId ? 'Etkinlik guncellendi' : 'Etkinlik eklendi');
      resetForm();
      setDialogOpen(false);
      fetchEvents();
    } else {
      toast.error(res.message || 'Hata olustu');
    }
    setSubmitting(false);
  };

  const handleEdit = (ev: any) => {
    setForm({ day: ev.day || '', name: ev.name || '', start_time: ev.start_time || '', end_time: ev.end_time || '' });
    setEditId(ev.id);
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    const res = await adminApi.deleteEvent(id);
    if (res.success) {
      toast.success('Etkinlik silindi');
      fetchEvents();
    } else {
      toast.error(res.message || 'Hata olustu');
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'Cinzel, serif' }}>Etkinlikler</h1>
        <Button onClick={() => { resetForm(); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Yeni Etkinlik
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editId ? 'Etkinlik Duzenle' : 'Yeni Etkinlik'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Gun</Label>
              <Input value={form.day} onChange={e => setForm({ ...form, day: e.target.value })} placeholder="Pazartesi" />
            </div>
            <div className="space-y-2">
              <Label>Etkinlik Adi</Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Boss Avlama" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Baslangic Saati</Label>
                <Input value={form.start_time} onChange={e => setForm({ ...form, start_time: e.target.value })} placeholder="20:00" />
              </div>
              <div className="space-y-2">
                <Label>Bitis Saati</Label>
                <Input value={form.end_time} onChange={e => setForm({ ...form, end_time: e.target.value })} placeholder="22:00" />
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
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : events.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Etkinlik bulunamadi</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Gun</TableHead>
                  <TableHead>Etkinlik</TableHead>
                  <TableHead>Baslangic</TableHead>
                  <TableHead>Bitis</TableHead>
                  <TableHead className="text-right">Islemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((ev: any) => (
                  <TableRow key={ev.id}>
                    <TableCell>{ev.id}</TableCell>
                    <TableCell>{ev.day}</TableCell>
                    <TableCell>{ev.name}</TableCell>
                    <TableCell>{ev.start_time || '-'}</TableCell>
                    <TableCell>{ev.end_time || '-'}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(ev)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(ev.id)}>
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
