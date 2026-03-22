import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollText, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { adminApi } from '@/api/admin';

export default function Logs() {
  const [shopLogs, setShopLogs] = useState<any[]>([]);
  const [banLogs, setBanLogs] = useState<any[]>([]);
  const [paymentLogs, setPaymentLogs] = useState<any[]>([]);
  const [shopPage, setShopPage] = useState(1);
  const [banPage, setBanPage] = useState(1);
  const [paymentPage, setPaymentPage] = useState(1);
  const [shopTotal, setShopTotal] = useState(0);
  const [banTotal, setBanTotal] = useState(0);
  const [paymentTotal, setPaymentTotal] = useState(0);
  const [loading, setLoading] = useState({ shop: true, ban: true, payment: true });

  const fetchShop = async (page: number) => {
    setLoading(l => ({ ...l, shop: true }));
    const res = await adminApi.getShopLogs(page);
    if (res.success && res.data) {
      setShopLogs(res.data.logs || res.data);
      setShopTotal(res.data.total_pages || 1);
    }
    setLoading(l => ({ ...l, shop: false }));
  };

  const fetchBan = async (page: number) => {
    setLoading(l => ({ ...l, ban: true }));
    const res = await adminApi.getBanLogs(page);
    if (res.success && res.data) {
      setBanLogs(res.data.logs || res.data);
      setBanTotal(res.data.total_pages || 1);
    }
    setLoading(l => ({ ...l, ban: false }));
  };

  const fetchPayment = async (page: number) => {
    setLoading(l => ({ ...l, payment: true }));
    const res = await adminApi.getPaymentLogs(page);
    if (res.success && res.data) {
      setPaymentLogs(res.data.logs || res.data);
      setPaymentTotal(res.data.total_pages || 1);
    }
    setLoading(l => ({ ...l, payment: false }));
  };

  useEffect(() => { fetchShop(1); fetchBan(1); fetchPayment(1); }, []);

  useEffect(() => { fetchShop(shopPage); }, [shopPage]);
  useEffect(() => { fetchBan(banPage); }, [banPage]);
  useEffect(() => { fetchPayment(paymentPage); }, [paymentPage]);

  const Pagination = ({ page, total, setPage }: { page: number; total: number; setPage: (p: number) => void }) => (
    <div className="flex items-center justify-center gap-2 mt-4">
      <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm text-muted-foreground">Sayfa {page} / {total || 1}</span>
      <Button variant="outline" size="sm" disabled={page >= total} onClick={() => setPage(page + 1)}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );

  const LogTable = ({ logs, columns, loadingState }: { logs: any[]; columns: { key: string; label: string }[]; loadingState: boolean }) => (
    loadingState ? (
      <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
    ) : logs.length === 0 ? (
      <p className="text-center text-muted-foreground py-8">Log bulunamadi</p>
    ) : (
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map(col => <TableHead key={col.key}>{col.label}</TableHead>)}
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log: any, i: number) => (
            <TableRow key={log.id || i}>
              {columns.map(col => (
                <TableCell key={col.key} className="max-w-[200px] truncate">{log[col.key] ?? '-'}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  );

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Cinzel, serif' }}>Loglar</h1>

      <Card className="glass-card">
        <CardContent className="pt-6">
          <Tabs defaultValue="shop">
            <TabsList className="mb-4">
              <TabsTrigger value="shop">Market Loglari</TabsTrigger>
              <TabsTrigger value="ban">Ban Loglari</TabsTrigger>
              <TabsTrigger value="payment">Odeme Loglari</TabsTrigger>
            </TabsList>

            <TabsContent value="shop">
              <LogTable
                logs={shopLogs}
                loadingState={loading.shop}
                columns={[
                  { key: 'id', label: 'ID' },
                  { key: 'username', label: 'Kullanici' },
                  { key: 'item_name', label: 'Urun' },
                  { key: 'price', label: 'Fiyat' },
                  { key: 'created_at', label: 'Tarih' },
                ]}
              />
              <Pagination page={shopPage} total={shopTotal} setPage={setShopPage} />
            </TabsContent>

            <TabsContent value="ban">
              <LogTable
                logs={banLogs}
                loadingState={loading.ban}
                columns={[
                  { key: 'id', label: 'ID' },
                  { key: 'username', label: 'Kullanici' },
                  { key: 'reason', label: 'Sebep' },
                  { key: 'banned_by', label: 'Banlayan' },
                  { key: 'created_at', label: 'Tarih' },
                ]}
              />
              <Pagination page={banPage} total={banTotal} setPage={setBanPage} />
            </TabsContent>

            <TabsContent value="payment">
              <LogTable
                logs={paymentLogs}
                loadingState={loading.payment}
                columns={[
                  { key: 'id', label: 'ID' },
                  { key: 'username', label: 'Kullanici' },
                  { key: 'amount', label: 'Miktar' },
                  { key: 'method', label: 'Yontem' },
                  { key: 'status', label: 'Durum' },
                  { key: 'created_at', label: 'Tarih' },
                ]}
              />
              <Pagination page={paymentPage} total={paymentTotal} setPage={setPaymentPage} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
