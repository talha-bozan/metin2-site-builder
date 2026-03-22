import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Send, Search, Loader2, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import { adminApi } from '@/api/admin';
import { toast } from 'sonner';

export default function ItemGive() {
  const [itemQuery, setItemQuery] = useState('');
  const [itemResults, setItemResults] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [accountQuery, setAccountQuery] = useState('');
  const [accountResults, setAccountResults] = useState<any[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [sockets, setSockets] = useState(['', '', '', '', '', '']);
  const [attrs, setAttrs] = useState(Array.from({ length: 7 }, () => ({ type: '', value: '' })));
  const [applyTypes, setApplyTypes] = useState<any[]>([]);
  const [count, setCount] = useState('1');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyTotal, setHistoryTotal] = useState(1);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [searchingItem, setSearchingItem] = useState(false);
  const [searchingAccount, setSearchingAccount] = useState(false);

  useEffect(() => {
    adminApi.getApplyTypes().then(res => {
      if (res.success && res.data) setApplyTypes(Array.isArray(res.data) ? res.data : res.data.data ?? []);
    });
    fetchHistory(1);
  }, []);

  const fetchHistory = async (page: number) => {
    setHistoryLoading(true);
    const res = await adminApi.getItemHistory(page);
    if (res.success && res.data) {
      setHistory(res.data.logs || res.data);
      setHistoryTotal(res.data.total_pages || 1);
    }
    setHistoryLoading(false);
  };

  useEffect(() => { fetchHistory(historyPage); }, [historyPage]);

  const searchItems = async () => {
    if (!itemQuery.trim()) return;
    setSearchingItem(true);
    const res = await adminApi.searchItems(itemQuery);
    if (res.success && res.data) setItemResults(Array.isArray(res.data) ? res.data : res.data.data ?? []);
    setSearchingItem(false);
  };

  const searchAccounts = async () => {
    if (!accountQuery.trim()) return;
    setSearchingAccount(true);
    const res = await adminApi.searchAccounts(accountQuery);
    if (res.success && res.data) setAccountResults(Array.isArray(res.data) ? res.data : res.data.data ?? []);
    setSearchingAccount(false);
  };

  const handleGive = async () => {
    if (!selectedItem) { toast.error('Item seciniz'); return; }
    if (!selectedAccount) { toast.error('Hesap seciniz'); return; }

    setSubmitting(true);
    const payload: any = {
      vnum: selectedItem.vnum,
      account_id: selectedAccount.id,
      count: Number(count) || 1,
      reason,
    };

    sockets.forEach((s, i) => { if (s) payload[`socket${i}`] = Number(s); });
    attrs.forEach((a, i) => {
      if (a.type) {
        payload[`attrtype${i}`] = Number(a.type);
        payload[`attrvalue${i}`] = Number(a.value) || 0;
      }
    });

    const res = await adminApi.giveItem(payload);
    if (res.success) {
      toast.success('Item verildi');
      setReason('');
      fetchHistory(1);
    } else {
      toast.error(res.error || 'Hata olustu');
    }
    setSubmitting(false);
  };

  const updateSocket = (i: number, val: string) => {
    const next = [...sockets];
    next[i] = val;
    setSockets(next);
  };

  const updateAttr = (i: number, field: 'type' | 'value', val: string) => {
    const next = [...attrs];
    next[i] = { ...next[i], [field]: val };
    setAttrs(next);
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Cinzel, serif' }}>Item Ver</h1>

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        {/* Item Search */}
        <Card className="glass-card">
          <CardHeader><CardTitle className="text-base">Item Sec</CardTitle></CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-3">
              <Input
                value={itemQuery}
                onChange={e => setItemQuery(e.target.value)}
                placeholder="Item adi veya vnum..."
                onKeyDown={e => e.key === 'Enter' && searchItems()}
              />
              <Button size="sm" onClick={searchItems} disabled={searchingItem}>
                {searchingItem ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              </Button>
            </div>
            {selectedItem && (
              <div className="p-2 bg-primary/10 rounded text-sm mb-2">
                Secili: <strong>{selectedItem.name || selectedItem.locale_name}</strong> (Vnum: {selectedItem.vnum})
              </div>
            )}
            {itemResults.length > 0 && (
              <div className="max-h-40 overflow-y-auto border rounded">
                {itemResults.map((item: any) => (
                  <button
                    key={item.vnum}
                    onClick={() => { setSelectedItem(item); setItemResults([]); }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-secondary/50 border-b last:border-0"
                  >
                    {item.name || item.locale_name} <span className="text-muted-foreground">(#{item.vnum})</span>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Search */}
        <Card className="glass-card">
          <CardHeader><CardTitle className="text-base">Hesap Sec</CardTitle></CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-3">
              <Input
                value={accountQuery}
                onChange={e => setAccountQuery(e.target.value)}
                placeholder="Hesap adi..."
                onKeyDown={e => e.key === 'Enter' && searchAccounts()}
              />
              <Button size="sm" onClick={searchAccounts} disabled={searchingAccount}>
                {searchingAccount ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              </Button>
            </div>
            {selectedAccount && (
              <div className="p-2 bg-primary/10 rounded text-sm mb-2">
                Secili: <strong>{selectedAccount.login || selectedAccount.username}</strong> (ID: {selectedAccount.id})
              </div>
            )}
            {accountResults.length > 0 && (
              <div className="max-h-40 overflow-y-auto border rounded">
                {accountResults.map((acc: any) => (
                  <button
                    key={acc.id}
                    onClick={() => { setSelectedAccount(acc); setAccountResults([]); }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-secondary/50 border-b last:border-0"
                  >
                    {acc.login || acc.username} <span className="text-muted-foreground">(ID: {acc.id})</span>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sockets */}
      <Card className="glass-card mb-6">
        <CardHeader><CardTitle className="text-base">Soketler</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {sockets.map((s, i) => (
              <div key={i} className="space-y-1">
                <Label className="text-xs">Socket{i}</Label>
                <Input type="number" value={s} onChange={e => updateSocket(i, e.target.value)} placeholder="0" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Attributes */}
      <Card className="glass-card mb-6">
        <CardHeader><CardTitle className="text-base">Bonuslar (Attr)</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {attrs.map((attr, i) => (
              <div key={i} className="grid grid-cols-[1fr_120px] gap-2 items-end">
                <div className="space-y-1">
                  <Label className="text-xs">Attr Type {i}</Label>
                  <Select value={attr.type} onValueChange={v => updateAttr(i, 'type', v)}>
                    <SelectTrigger><SelectValue placeholder="Bonus sec..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Yok</SelectItem>
                      {applyTypes.map((at: any) => (
                        <SelectItem key={at.id ?? at.value} value={String(at.id ?? at.value)}>
                          {at.name || at.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Deger {i}</Label>
                  <Input type="number" value={attr.value} onChange={e => updateAttr(i, 'value', e.target.value)} placeholder="0" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Count, Reason, Submit */}
      <Card className="glass-card mb-6">
        <CardContent className="pt-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Adet</Label>
              <Input type="number" value={count} onChange={e => setCount(e.target.value)} min="1" />
            </div>
            <div className="space-y-2">
              <Label>Sebep</Label>
              <Input value={reason} onChange={e => setReason(e.target.value)} placeholder="Verme sebebi..." />
            </div>
            <div className="flex items-end">
              <Button onClick={handleGive} disabled={submitting} className="w-full">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                Item Ver
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* History */}
      <Card className="glass-card">
        <CardHeader><CardTitle className="flex items-center gap-2"><Package className="h-5 w-5" /> Gecmis</CardTitle></CardHeader>
        <CardContent>
          {historyLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : history.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Gecmis bulunamadi</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Hesap</TableHead>
                    <TableHead>Adet</TableHead>
                    <TableHead>Sebep</TableHead>
                    <TableHead>Veren</TableHead>
                    <TableHead>Tarih</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((h: any, i: number) => (
                    <TableRow key={h.id || i}>
                      <TableCell>{h.id}</TableCell>
                      <TableCell>{h.item_name || h.vnum}</TableCell>
                      <TableCell>{h.account_login || h.account_name || h.account_id}</TableCell>
                      <TableCell>{h.count}</TableCell>
                      <TableCell className="max-w-[150px] truncate">{h.reason || '-'}</TableCell>
                      <TableCell>{h.given_by || '-'}</TableCell>
                      <TableCell>{h.tarih || h.created_at || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex items-center justify-center gap-2 mt-4">
                <Button variant="outline" size="sm" disabled={historyPage <= 1} onClick={() => setHistoryPage(p => p - 1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">Sayfa {historyPage} / {historyTotal}</span>
                <Button variant="outline" size="sm" disabled={historyPage >= historyTotal} onClick={() => setHistoryPage(p => p + 1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
