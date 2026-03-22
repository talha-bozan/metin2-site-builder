import { useState } from 'react';
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

const sampleTickets = [
  { id: 1, ticketid: 1001, title: 'Item kayboldu', status: 0, tarih: '2023-04-20 14:30:00', type: 0 },
  { id: 2, ticketid: 1002, title: 'EP yükleme sorunu', status: 1, tarih: '2023-04-19 10:15:00', type: 1 },
];

const statusMap: Record<number, { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
  0: { label: 'Açık', variant: 'default' },
  1: { label: 'Yanıtlandı', variant: 'secondary' },
  2: { label: 'Kapatıldı', variant: 'destructive' },
};

export default function Support() {
  const { isAuthenticated } = useAuth();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Destek talebi oluşturmak için giriş yapınız'); return; }
    if (!title.trim() || !message.trim() || !category) { toast.error('Tüm alanları doldurunuz'); return; }
    setLoading(true);
    setTimeout(() => {
      toast.success('Destek talebiniz oluşturuldu!');
      setTitle(''); setMessage(''); setCategory('');
      setLoading(false);
    }, 1000);
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
              <CardDescription>Sorununuzu detaylı açıklayın</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Kategori</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger><SelectValue placeholder="Seçiniz" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="teknik">Teknik Sorun</SelectItem>
                      <SelectItem value="odeme">Ödeme Sorunu</SelectItem>
                      <SelectItem value="hesap">Hesap Sorunu</SelectItem>
                      <SelectItem value="sikayet">Şikayet</SelectItem>
                      <SelectItem value="oneri">Öneri</SelectItem>
                      <SelectItem value="diger">Diğer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Başlık</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Kısa başlık" maxLength={100} />
                </div>
                <div className="space-y-2">
                  <Label>Mesaj</Label>
                  <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Sorununuzu detaylı açıklayın..." rows={5} maxLength={1000} />
                </div>
                <Button type="submit" className="w-full active:scale-[0.97] transition-transform" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Gönder
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
                <p className="text-sm text-muted-foreground text-center py-8">Taleplerinizi görmek için giriş yapınız</p>
              ) : sampleTickets.length === 0 ? (
                <div className="flex flex-col items-center py-8 text-muted-foreground">
                  <MessageCircle className="h-10 w-10 mb-2 opacity-40" />
                  <p className="text-sm">Henüz destek talebiniz yok</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {sampleTickets.map((t) => {
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
