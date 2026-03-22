import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LifeBuoy, Eye, X, Send, Loader2, ArrowLeft } from 'lucide-react';
import { adminApi } from '@/api/admin';
import { toast } from 'sonner';

export default function Tickets() {
  const [unread, setUnread] = useState<any[]>([]);
  const [read, setRead] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [ticketReplies, setTicketReplies] = useState<any[]>([]);
  const [ticketLoading, setTicketLoading] = useState(false);
  const [reply, setReply] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    const [res1, res2] = await Promise.all([adminApi.getUnreadTickets(), adminApi.getReadTickets()]);
    if (res1.success && res1.data) setUnread(Array.isArray(res1.data) ? res1.data : (res1.data as any).data ?? []);
    if (res2.success && res2.data) setRead(Array.isArray(res2.data) ? res2.data : (res2.data as any).data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchTickets(); }, []);

  const viewTicket = async (id: number) => {
    setTicketLoading(true);
    const res = await adminApi.getTicket(id);
    if (res.success && res.data) {
      const d = res.data as any;
      // Backend returns { ticket: {...}, replies: [...] }
      setSelectedTicket(d.ticket || d);
      setTicketReplies(d.replies || []);
    }
    setTicketLoading(false);
  };

  const handleReply = async () => {
    if (!reply.trim() || !selectedTicket) return;
    setSubmitting(true);
    const res = await adminApi.replyTicket(selectedTicket.id, reply);
    if (res.success) {
      toast.success('Yanit gonderildi');
      setReply('');
      viewTicket(selectedTicket.id);
      fetchTickets();
    } else {
      toast.error(res.error || 'Hata olustu');
    }
    setSubmitting(false);
  };

  const handleClose = async () => {
    if (!selectedTicket) return;
    const res = await adminApi.closeTicket(selectedTicket.id);
    if (res.success) {
      toast.success('Ticket kapatildi');
      setSelectedTicket(null);
      setTicketReplies([]);
      fetchTickets();
    } else {
      toast.error(res.error || 'Hata olustu');
    }
  };

  const getStatusLabel = (status: number | string) => {
    const s = typeof status === 'number' ? status : parseInt(String(status), 10);
    if (s === 0) return { label: 'Yeni', variant: 'default' as const };
    if (s === 1) return { label: 'Yanitlandi', variant: 'secondary' as const };
    if (s === 2) return { label: 'Kapali', variant: 'outline' as const };
    return { label: String(status), variant: 'secondary' as const };
  };

  const isOpen = (status: number | string) => {
    const s = typeof status === 'number' ? status : parseInt(String(status), 10);
    return s < 2;
  };

  if (selectedTicket) {
    return (
      <AdminLayout>
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" onClick={() => { setSelectedTicket(null); setTicketReplies([]); }}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Geri
          </Button>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Cinzel, serif' }}>
            Ticket #{selectedTicket.id}
          </h1>
          <Badge variant={getStatusLabel(selectedTicket.status).variant}>
            {getStatusLabel(selectedTicket.status).label}
          </Badge>
        </div>

        <Card className="glass-card mb-6">
          <CardHeader>
            <CardTitle className="text-lg">{selectedTicket.title || selectedTicket.subject || 'Konu belirtilmemis'}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {selectedTicket.username} - {selectedTicket.tarih || selectedTicket.created_at || ''}
            </p>
          </CardHeader>
          <CardContent>
            {ticketLoading ? (
              <div className="flex justify-center py-4"><Loader2 className="h-6 w-6 animate-spin" /></div>
            ) : (
              <div className="space-y-4">
                {/* Original ticket message */}
                <div className="p-4 rounded-lg bg-secondary/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{selectedTicket.username}</span>
                    <span className="text-xs text-muted-foreground">{selectedTicket.tarih || selectedTicket.created_at || ''}</span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{selectedTicket.message}</p>
                </div>

                {/* Replies */}
                {ticketReplies.map((msg: any, i: number) => {
                  const isAdmin = msg.username?.includes('Admin') || msg.accountid === 0;
                  return (
                    <div key={msg.id || i} className={`p-4 rounded-lg ${isAdmin ? 'bg-primary/10 border border-primary/20' : 'bg-secondary/50'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          {isAdmin ? 'Admin' : msg.username || selectedTicket.username}
                        </span>
                        <span className="text-xs text-muted-foreground">{msg.tarih || msg.created_at || ''}</span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {isOpen(selectedTicket.status) && (
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Yanit</Label>
                  <Textarea value={reply} onChange={e => setReply(e.target.value)} placeholder="Yanitinizi yazin..." rows={4} />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleReply} disabled={submitting || !reply.trim()}>
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                    Yanit Gonder
                  </Button>
                  <Button variant="destructive" onClick={handleClose}>
                    <X className="h-4 w-4 mr-2" /> Ticketi Kapat
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </AdminLayout>
    );
  }

  const TicketTable = ({ tickets }: { tickets: any[] }) => (
    tickets.length === 0 ? (
      <p className="text-center text-muted-foreground py-8">Ticket bulunamadi</p>
    ) : (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Kullanici</TableHead>
            <TableHead>Konu</TableHead>
            <TableHead>Durum</TableHead>
            <TableHead>Tarih</TableHead>
            <TableHead className="text-right">Islem</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((t: any) => (
            <TableRow key={t.id}>
              <TableCell>{t.id}</TableCell>
              <TableCell>{t.username}</TableCell>
              <TableCell className="max-w-[200px] truncate">{t.title || t.subject || '-'}</TableCell>
              <TableCell>
                <Badge variant={getStatusLabel(t.status).variant}>
                  {getStatusLabel(t.status).label}
                </Badge>
              </TableCell>
              <TableCell>{t.tarih || t.created_at || '-'}</TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm" onClick={() => viewTicket(t.id)}>
                  <Eye className="h-4 w-4 mr-1" /> Goruntule
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  );

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Cinzel, serif' }}>Ticketlar</h1>

      <Card className="glass-card">
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : (
            <Tabs defaultValue="unread">
              <TabsList className="mb-4">
                <TabsTrigger value="unread">Okunmamis ({unread.length})</TabsTrigger>
                <TabsTrigger value="read">Okunmus ({read.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="unread"><TicketTable tickets={unread} /></TabsContent>
              <TabsContent value="read"><TicketTable tickets={read} /></TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
