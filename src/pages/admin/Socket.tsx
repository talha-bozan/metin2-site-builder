import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserX, MessageSquare, Megaphone, Send, Loader2 } from 'lucide-react';
import { adminApi } from '@/api/admin';
import { toast } from 'sonner';

export default function Socket() {
  const [dcName, setDcName] = useState('');
  const [chatMsg, setChatMsg] = useState('');
  const [noticeMsg, setNoticeMsg] = useState('');
  const [dcLoading, setDcLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [noticeLoading, setNoticeLoading] = useState(false);

  const handleDc = async () => {
    if (!dcName.trim()) { toast.error('Oyuncu adi giriniz'); return; }
    setDcLoading(true);
    const res = await adminApi.dcPlayer(dcName);
    if (res.success) {
      toast.success(res.data?.message || 'Oyuncu baglantisi kesildi');
      setDcName('');
    } else {
      toast.error(res.error || 'Hata olustu');
    }
    setDcLoading(false);
  };

  const handleChat = async () => {
    if (!chatMsg.trim()) { toast.error('Mesaj giriniz'); return; }
    setChatLoading(true);
    const res = await adminApi.sendChat(chatMsg);
    if (res.success) {
      toast.success(res.data?.message || 'Chat mesaji gonderildi');
      setChatMsg('');
    } else {
      toast.error(res.error || 'Hata olustu');
    }
    setChatLoading(false);
  };

  const handleNotice = async () => {
    if (!noticeMsg.trim()) { toast.error('Duyuru giriniz'); return; }
    setNoticeLoading(true);
    const res = await adminApi.sendNotice(noticeMsg);
    if (res.success) {
      toast.success(res.data?.message || 'Duyuru gonderildi');
      setNoticeMsg('');
    } else {
      toast.error(res.error || 'Hata olustu');
    }
    setNoticeLoading(false);
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Cinzel, serif' }}>Sunucu Komutlari</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* DC Player */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><UserX className="h-5 w-5 text-red-500" /> Oyuncu DC</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Oyuncu Adi</Label>
                <Input
                  value={dcName}
                  onChange={e => setDcName(e.target.value)}
                  placeholder="Oyuncu adi..."
                  onKeyDown={e => e.key === 'Enter' && handleDc()}
                />
              </div>
              <Button onClick={handleDc} disabled={dcLoading} className="w-full" variant="destructive">
                {dcLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <UserX className="h-4 w-4 mr-2" />}
                Baglanti Kes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Send Chat */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5 text-blue-500" /> Chat Gonder</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Mesaj</Label>
                <Input
                  value={chatMsg}
                  onChange={e => setChatMsg(e.target.value)}
                  placeholder="Chat mesaji..."
                  onKeyDown={e => e.key === 'Enter' && handleChat()}
                />
              </div>
              <Button onClick={handleChat} disabled={chatLoading} className="w-full">
                {chatLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                Gonder
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Send Notice */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Megaphone className="h-5 w-5 text-yellow-500" /> Duyuru Gonder</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Duyuru</Label>
                <Input
                  value={noticeMsg}
                  onChange={e => setNoticeMsg(e.target.value)}
                  placeholder="Duyuru mesaji..."
                  onKeyDown={e => e.key === 'Enter' && handleNotice()}
                />
              </div>
              <Button onClick={handleNotice} disabled={noticeLoading} className="w-full">
                {noticeLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Megaphone className="h-4 w-4 mr-2" />}
                Gonder
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
