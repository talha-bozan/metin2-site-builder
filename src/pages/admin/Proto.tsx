import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Loader2, Database, Sword, Bug } from 'lucide-react';
import { adminApi } from '@/api/admin';
import { toast } from 'sonner';

export default function Proto() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) { toast.error('Arama terimi giriniz'); return; }
    setLoading(true);
    const res = await adminApi.searchProto(query);
    if (res.success && res.data) {
      const items = Array.isArray(res.data) ? res.data : res.data.data ?? [];
      setResults(items);
      if (items.length === 0) toast.info('Sonuc bulunamadi');
    } else {
      toast.error(res.error || 'Hata olustu');
    }
    setLoading(false);
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Cinzel, serif' }}>Proto Arama</h1>

      <Card className="glass-card mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Item veya Mob adi/vnum ile ara..."
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
          <CardHeader><CardTitle className="flex items-center gap-2"><Database className="h-5 w-5" /> Sonuclar ({results.length})</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Tür</TableHead>
                    <TableHead>Vnum</TableHead>
                    <TableHead>Ad</TableHead>
                    <TableHead>Tip</TableHead>
                    <TableHead>Alt Tip</TableHead>
                    <TableHead>Seviye</TableHead>
                    <TableHead>Deger</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((item: any, i: number) => {
                    const isMob = item.type === 'mob';
                    return (
                      <TableRow key={`${item.type}-${item.vnum}` || i} className={isMob ? 'bg-red-950/20' : ''}>
                        <TableCell>
                          {isMob ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-400"><Bug className="h-3.5 w-3.5" /> Mob</span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400"><Sword className="h-3.5 w-3.5" /> Item</span>
                          )}
                        </TableCell>
                        <TableCell className="font-mono">{item.vnum}</TableCell>
                        <TableCell className="font-medium">{item.name || item.locale_name}</TableCell>
                        <TableCell>{isMob ? '-' : (item.item_type ?? '-')}</TableCell>
                        <TableCell>{isMob ? '-' : (item.subtype ?? '-')}</TableCell>
                        <TableCell>{item.level ?? '-'}</TableCell>
                        <TableCell>{item.gold ?? item.value ?? '-'}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </AdminLayout>
  );
}
