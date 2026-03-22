import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { LifeBuoy, Send, MessageCircle, Clock, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { ticketsApi } from '@/api/tickets';

const statusMap: Record<number, { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
  0: { label: 'Acik', variant: 'default' },
  1: { label: 'Yanitlandi', variant: 'secondary' },
  2: { label: 'Kapatildi', variant: 'destructive' },
};

export default function Support() {
  const { isAuthenticated } = useAuth();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState<any[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { setTicketsLoading(false); return; }
    ticketsApi.getTickets().then(res => {
      if (res.success && res.data) setTickets(Array.isArray(res.data) ? res.data : []);
      setTicketsLoading(false);
    });
  }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Destek talebi olusturmak icin giris yapiniz'); return; }
    if (!title.trim() || !message.trim() || !category) { toast.error('Tum alanlari doldurunuz'); return; }
    setLoading(true);
    const res = await ticketsApi.createTicket(title, message, category);
    setLoading(false);
    if (res.success) {
      toast.success('Destek talebiniz olusturuldu!');
      setTitle(''); setMessage(''); setCategory('');
      // Refresh tickets
      const tRes = await ticketsApi.getTickets();
      if (tRes.success && tRes.data) setTickets(Array.isArray(tRes.data) ? tRes.data : []);
    } else {
      toast.error(res.error || 'Talep olusturulamadi');
    }
  };

  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ fontFamily: 'Cinzel, serif', lineHeight: '1.1' }}>
          <LifeBuoy className="h-6 w-6 text-primary" />
          Destek Merkezi
        </h1>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Ticket Form */}
          <Card className="glass-card lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base" style={{ fontFamily: 'Cinzel, serif' }}>Yeni Talep</CardTitle>
              <CardDescription>Sorununuzu detayli aciklayin</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Kategori</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger><SelectValue placeholder="Seciniz" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="teknik">Teknik Sorun</SelectItem>
                      <SelectItem value="odeme">Odeme Sorunu</SelectItem>
                      <SelectItem value="hesap">Hesap Sorunu</SelectItem>
                      <SelectItem value="sikayet">Sikayet</SelectItem>
                      <SelectItem value="oneri">Oneri</SelectItem>
                      <SelectItem value="diger">Diger</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Baslik</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Kisa baslik" maxLength={100} />
                </div>
                <div className="space-y-2">
                  <Label>Mesaj</Label>
                  <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Sorununuzu detayli aciklayin..." rows={5} maxLength={1000} />
                </div>
                <Button type="submit" className="w-full active:scale-[0.97] transition-transform" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Gonder
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Ticket List */}
          <Card className="glass-card lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-base" style={{ fontFamily: 'Cinzel, serif' }}>Taleplerim</CardTitle>
            </CardHeader>
            <CardContent>
              {!isAuthenticated ? (
                <p className="text-sm text-muted-foreground text-center py-8">Taleplerinizi gormek icin giris yapiniz</p>
              ) : ticketsLoading ? (
                <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
              ) : tickets.length === 0 ? (
                <div className="flex flex-col items-center py-8 text-muted-foreground">
                  <MessageCircle className="h-10 w-10 mb-2 opacity-40" />
                  <p className="text-sm">Henuz destek talebiniz yok</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {tickets.map((t: any) => {
                    const status = statusMap[t.status] || statusMap[0];
                    return (
                      <div key={t.id} className="flex items-center justify-between rounded-lg bg-secondary/30 px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-foreground">#{t.ticketid} — {t.title}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Clock className="h-3 w-3" /> {t.tarih}
                          </p>
                        </div>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
