import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Gamepad2, Search, Eye, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { adminApi } from '@/api/admin';
import { api } from '@/api/client';
import { toast } from 'sonner';

export default function Players() {
  const [query, setQuery] = useState('');
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [playerLoading, setPlayerLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchPlayers = async (p: number) => {
    setLoading(true);
    const res = await api.get(`/admin/players?page=${p}`);
    if (res.success && res.data) {
      const d = res.data as any;
      setPlayers(d.players ?? (Array.isArray(d) ? d : []));
      setTotalPages(d.totalPages ?? 1);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!isSearchMode) fetchPlayers(page);
  }, [page, isSearchMode]);

  const handleSearch = async () => {
    if (!query.trim()) {
      setIsSearchMode(false);
      setPage(1);
      return;
    }
    setLoading(true);
    setIsSearchMode(true);
    const res = await adminApi.searchPlayers(query);
    if (res.success && res.data) {
      const data = Array.isArray(res.data) ? res.data : (res.data as any).data ?? [];
      setPlayers(data);
      setTotalPages(1);
      if (data.length === 0) toast.info('Oyuncu bulunamadi');
    } else {
      toast.error(res.error || 'Hata olustu');
    }
    setLoading(false);
  };

  const clearSearch = () => {
    setQuery('');
    setIsSearchMode(false);
    setPage(1);
  };

  const viewPlayer = async (id: number) => {
    setPlayerLoading(true);
    setDialogOpen(true);
    const res = await adminApi.getPlayer(id);
    if (res.success && res.data) {
      const d = res.data as any;
      setSelectedPlayer(d.player || d);
    }
    setPlayerLoading(false);
  };

  const JOB_NAMES: Record<number, string> = {
    0: 'Savaşçı', 1: 'Ninja', 2: 'Sura', 3: 'Şaman',
    4: 'Lycan',
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
            {isSearchMode && (
              <Button variant="outline" onClick={clearSearch}>Temizle</Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gamepad2 className="h-5 w-5" />
            {isSearchMode ? `Arama Sonuclari (${players.length})` : 'Oyuncu Listesi'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : players.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Oyuncu bulunamadi</p>
          ) : (
            <>
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
                  {players.map((p: any) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-mono text-muted-foreground">{p.id}</TableCell>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell>{p.level}</TableCell>
                      <TableCell>{JOB_NAMES[p.job] ?? p.job ?? '-'}</TableCell>
                      <TableCell className="font-mono">{(p.gold ?? p.money ?? 0).toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => viewPlayer(p.id)}>
                          <Eye className="h-4 w-4 mr-1" /> Goruntule
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {!isSearchMode && totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-border px-4 py-3 mt-4">
                  <span className="text-sm text-muted-foreground">
                    Sayfa {page} / {totalPages}
                  </span>
                  <div className="flex gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={page <= 1}
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={page >= totalPages}
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

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
                { label: 'Sinif', value: JOB_NAMES[selectedPlayer.job] ?? selectedPlayer.job },
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
