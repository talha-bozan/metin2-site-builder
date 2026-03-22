import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminApi } from '@/api/admin';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Search, Ban, ShieldCheck, Coins, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

interface Account {
  id: number;
  login: string;
  status: string;
}

export default function Accounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  // Ban dialog
  const [banOpen, setBanOpen] = useState(false);
  const [banTarget, setBanTarget] = useState<Account | null>(null);
  const [banReason, setBanReason] = useState('');
  const [banLoading, setBanLoading] = useState(false);

  // EP dialog
  const [epOpen, setEpOpen] = useState(false);
  const [epTarget, setEpTarget] = useState<Account | null>(null);
  const [epAmount, setEpAmount] = useState('');
  const [epReason, setEpReason] = useState('');
  const [epLoading, setEpLoading] = useState(false);

  const fetchAccounts = async (p: number) => {
    setLoading(true);
    try {
      const res = await adminApi.getAccounts(p);
      if (res.success && res.data) {
        setAccounts(res.data.accounts ?? res.data.data ?? []);
        setTotalPages(res.data.totalPages ?? res.data.last_page ?? 1);
      }
    } catch {
      toast.error('Hesaplar yuklenirken hata olustu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts(page);
  }, [page]);

  const handleSearch = async () => {
    if (!search.trim()) {
      fetchAccounts(1);
      setPage(1);
      return;
    }
    setLoading(true);
    try {
      const res = await adminApi.searchAccounts(search.trim());
      if (res.success && res.data) {
        setAccounts(Array.isArray(res.data) ? res.data : res.data.accounts ?? []);
        setTotalPages(1);
      }
    } catch {
      toast.error('Arama sirasinda hata olustu');
    } finally {
      setLoading(false);
    }
  };

  const handleBan = async () => {
    if (!banTarget || !banReason.trim()) return;
    setBanLoading(true);
    try {
      const res = await adminApi.banAccount(banTarget.id, banReason.trim());
      if (res.success) {
        toast.success(`${banTarget.login} hesabi banlandi`);
        setBanOpen(false);
        setBanReason('');
        setBanTarget(null);
        fetchAccounts(page);
      } else {
        toast.error(res.error || 'Ban islemi basarisiz');
      }
    } catch {
      toast.error('Ban islemi sirasinda hata olustu');
    } finally {
      setBanLoading(false);
    }
  };

  const handleUnban = async (account: Account) => {
    try {
      const res = await adminApi.unbanAccount(account.id);
      if (res.success) {
        toast.success(`${account.login} hesabinin bani kaldirildi`);
        fetchAccounts(page);
      } else {
        toast.error(res.error || 'Unban islemi basarisiz');
      }
    } catch {
      toast.error('Unban islemi sirasinda hata olustu');
    }
  };

  const handleAddEP = async () => {
    if (!epTarget || !epAmount) return;
    const amount = parseInt(epAmount, 10);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Gecerli bir miktar girin');
      return;
    }
    setEpLoading(true);
    try {
      const res = await adminApi.addEP(epTarget.id, amount, epReason.trim());
      if (res.success) {
        toast.success(`${epTarget.login} hesabina ${amount} EP eklendi`);
        setEpOpen(false);
        setEpAmount('');
        setEpReason('');
        setEpTarget(null);
      } else {
        toast.error(res.error || 'EP ekleme basarisiz');
      }
    } catch {
      toast.error('EP ekleme sirasinda hata olustu');
    } finally {
      setEpLoading(false);
    }
  };

  const statusBadge = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'ok' || s === 'active' || s === 'aktif') {
      return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Aktif</Badge>;
    }
    if (s === 'ban' || s === 'banned' || s === 'block') {
      return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Banli</Badge>;
    }
    return <Badge variant="secondary">{status}</Badge>;
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Cinzel, serif' }}>Hesaplar</h1>

      {/* Search */}
      <div className="glass-card rounded-lg p-4 mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Hesap adi ile ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-9"
            />
          </div>
          <Button onClick={handleSearch} variant="secondary">
            Ara
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : accounts.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">Hesap bulunamadi</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">ID</TableHead>
                <TableHead>Hesap Adi</TableHead>
                <TableHead className="w-28">Durum</TableHead>
                <TableHead className="text-right w-56">Islemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-mono text-muted-foreground">{account.id}</TableCell>
                  <TableCell className="font-medium">{account.login}</TableCell>
                  <TableCell>{statusBadge(account.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-7 px-2 text-xs"
                        onClick={() => {
                          setBanTarget(account);
                          setBanOpen(true);
                        }}
                      >
                        <Ban className="h-3.5 w-3.5 mr-1" />
                        Ban
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 text-xs"
                        onClick={() => handleUnban(account)}
                      >
                        <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                        Unban
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-7 px-2 text-xs"
                        onClick={() => {
                          setEpTarget(account);
                          setEpOpen(true);
                        }}
                      >
                        <Coins className="h-3.5 w-3.5 mr-1" />
                        EP Ekle
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <span className="text-sm text-muted-foreground">
              Sayfa {page} / {totalPages}
            </span>
            <div className="flex gap-1.5">
              <Button
                size="sm"
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Ban Dialog */}
      <Dialog open={banOpen} onOpenChange={setBanOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hesap Banla</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{banTarget?.login}</span> hesabini banlamak istediginize emin misiniz?
            </p>
            <div className="space-y-2">
              <Label>Ban Sebebi</Label>
              <Textarea
                placeholder="Ban sebebini yazin..."
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Iptal</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleBan}
              disabled={!banReason.trim() || banLoading}
            >
              {banLoading && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
              Banla
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EP Dialog */}
      <Dialog open={epOpen} onOpenChange={setEpOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>EP Ekle</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{epTarget?.login}</span> hesabina EP ekle
            </p>
            <div className="space-y-2">
              <Label>Miktar</Label>
              <Input
                type="number"
                min={1}
                placeholder="EP miktari"
                value={epAmount}
                onChange={(e) => setEpAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Sebep (opsiyonel)</Label>
              <Input
                placeholder="EP ekleme sebebi"
                value={epReason}
                onChange={(e) => setEpReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Iptal</Button>
            </DialogClose>
            <Button
              onClick={handleAddEP}
              disabled={!epAmount || epLoading}
            >
              {epLoading && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
              EP Ekle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
