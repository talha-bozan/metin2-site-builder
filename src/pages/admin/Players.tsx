import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Gamepad2, Search, Eye, Loader2 } from 'lucide-react';
import { adminApi } from '@/api/admin';
import { toast } from 'sonner';

export default function Players() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [playerLoading, setPlayerLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) { toast.error('Arama terimi giriniz'); return; }
    setLoading(true);
    const res = await adminApi.searchPlayers(query);
    if (res.success && res.data) {
      setResults(res.data);
      if (res.data.length === 0) toast.info('Oyuncu bulunamadi');
    } else {
      toast.error(res.message || 'Hata olustu');
    }
    setLoading(false);
  };

  const viewPlayer = async (id: number) => {
    setPlayerLoading(true);
    setDialogOpen(true);
    const res = await adminApi.getPlayer(id);
    if (res.success && res.data) setSelectedPlayer(res.data);
    setPlayerLoading(false);
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Cinzel, serif' }}>Oyuncular</h1>

      <Card className="glass-card mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Oyuncu adi ile ara..."
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
              {!loading && 'Ara'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card className="glass-card">
          <CardHeader><CardTitle className="flex items-center gap-2"><Gamepad2 className="h-5 w-5" /> Sonuclar ({results.length})</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Ad</TableHead>
                  <TableHead>Seviye</TableHead>
                  <TableHead>Sinif</TableHead>
                  <TableHead>Yang</TableHead>
                  <TableHead className="text-right">Islem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((p: any) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.id}</TableCell>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.level}</TableCell>
                    <TableCell>{p.job ?? '-'}</TableCell>
                    <TableCell>{(p.gold ?? p.money ?? 0).toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => viewPlayer(p.id)}>
                        <Eye className="h-4 w-4 mr-1" /> Goruntule
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Oyuncu Detayi</DialogTitle></DialogHeader>
          {playerLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : selectedPlayer ? (
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'ID', value: selectedPlayer.id },
                { label: 'Ad', value: selectedPlayer.name },
                { label: 'Seviye', value: selectedPlayer.level },
                { label: 'Sinif', value: selectedPlayer.job },
                { label: 'Yang', value: (selectedPlayer.gold ?? selectedPlayer.money ?? 0).toLocaleString() },
                { label: 'HP', value: selectedPlayer.hp },
                { label: 'MP', value: selectedPlayer.mp },
                { label: 'STR', value: selectedPlayer.st },
                { label: 'DEX', value: selectedPlayer.dx },
                { label: 'INT', value: selectedPlayer.iq },
                { label: 'VIT', value: selectedPlayer.ht },
                { label: 'Hesap ID', value: selectedPlayer.account_id },
                { label: 'Harita', value: selectedPlayer.map_index },
                { label: 'Son Giris', value: selectedPlayer.last_play },
              ].map(item => (
                <div key={item.label}>
                  <Label className="text-muted-foreground text-xs">{item.label}</Label>
                  <p className="text-sm font-medium">{item.value ?? '-'}</p>
                </div>
              ))}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
