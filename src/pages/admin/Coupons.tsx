import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Gift, Plus, Trash2, Loader2 } from 'lucide-react';
import { adminApi } from '@/api/admin';
import { toast } from 'sonner';

export default function Coupons() {
  const [unusedCoupons, setUnusedCoupons] = useState<any[]>([]);
  const [usedCoupons, setUsedCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [type, setType] = useState('ep');
  const [value, setValue] = useState('');
  const [vnum, setVnum] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchCoupons = async () => {
    setLoading(true);
    const [res1, res2] = await Promise.all([adminApi.getCoupons(), adminApi.getUsedCoupons()]);
    if (res1.success && res1.data) setUnusedCoupons(res1.data);
    if (res2.success && res2.data) setUsedCoupons(res2.data);
    setLoading(false);
  };

  useEffect(() => { fetchCoupons(); }, []);

  const handleCreate = async () => {
    if (!code.trim() || !value) { toast.error('Kod ve deger giriniz'); return; }
    setSubmitting(true);
    const res = await adminApi.createCoupon({ code, type, value: Number(value), vnum: vnum ? Number(vnum) : undefined });
    if (res.success) {
      toast.success('Kupon olusturuldu');
      setCode(''); setValue(''); setVnum('');
      fetchCoupons();
    } else {
      toast.error(res.message || 'Hata olustu');
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: number) => {
    const res = await adminApi.deleteCoupon(id);
    if (res.success) {
      toast.success('Kupon silindi');
      fetchCoupons();
    } else {
      toast.error(res.message || 'Hata olustu');
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Cinzel, serif' }}>Kuponlar</h1>

      <Card className="glass-card mb-6">
        <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="h-5 w-5" /> Yeni Kupon</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-2">
              <Label>Kupon Kodu</Label>
              <Input value={code} onChange={e => setCode(e.target.value)} placeholder="KUPON2024" />
            </div>
            <div className="space-y-2">
              <Label>Tip</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ep">EP</SelectItem>
                  <SelectItem value="item">Item</SelectItem>
                  <SelectItem value="discount">Indirim (%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Deger</Label>
              <Input type="number" value={value} onChange={e => setValue(e.target.value)} placeholder="100" />
            </div>
            <div className="space-y-2">
              <Label>Vnum (Item icin)</Label>
              <Input type="number" value={vnum} onChange={e => setVnum(e.target.value)} placeholder="Opsiyonel" />
            </div>
            <div className="flex items-end">
              <Button onClick={handleCreate} disabled={submitting} className="w-full">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                Olustur
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : (
            <Tabs defaultValue="unused">
              <TabsList className="mb-4">
                <TabsTrigger value="unused">Kullanilmamis ({unusedCoupons.length})</TabsTrigger>
                <TabsTrigger value="used">Kullanilmis ({usedCoupons.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="unused">
                {unusedCoupons.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Kullanilmamis kupon yok</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Kod</TableHead>
                        <TableHead>Tip</TableHead>
                        <TableHead>Deger</TableHead>
                        <TableHead>Vnum</TableHead>
                        <TableHead className="text-right">Islem</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {unusedCoupons.map((c: any) => (
                        <TableRow key={c.id}>
                          <TableCell>{c.id}</TableCell>
                          <TableCell><code className="text-primary">{c.code}</code></TableCell>
                          <TableCell><Badge variant="outline">{c.type}</Badge></TableCell>
                          <TableCell>{c.value}</TableCell>
                          <TableCell>{c.vnum || '-'}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(c.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </TabsContent>
              <TabsContent value="used">
                {usedCoupons.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Kullanilmis kupon yok</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Kod</TableHead>
                        <TableHead>Tip</TableHead>
                        <TableHead>Deger</TableHead>
                        <TableHead>Kullanan</TableHead>
                        <TableHead>Tarih</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usedCoupons.map((c: any) => (
                        <TableRow key={c.id}>
                          <TableCell>{c.id}</TableCell>
                          <TableCell><code>{c.code}</code></TableCell>
                          <TableCell><Badge variant="secondary">{c.type}</Badge></TableCell>
                          <TableCell>{c.value}</TableCell>
                          <TableCell>{c.used_by || '-'}</TableCell>
                          <TableCell>{c.used_at || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
