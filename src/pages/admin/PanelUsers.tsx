import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Shield, Plus, Trash2, Loader2 } from 'lucide-react';
import { adminApi } from '@/api/admin';
import { toast } from 'sonner';

export default function PanelUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [permission, setPermission] = useState('admin');
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await adminApi.getUsers();
    if (res.success && res.data) setUsers(Array.isArray(res.data) ? res.data : res.data.data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreate = async () => {
    if (!username.trim() || !password.trim()) { toast.error('Kullanici adi ve sifre giriniz'); return; }
    setSubmitting(true);
    const res = await adminApi.createUser({ username, password, permission });
    if (res.success) {
      toast.success('Kullanici olusturuldu');
      setUsername(''); setPassword(''); setPermission('admin');
      fetchUsers();
    } else {
      toast.error(res.error || 'Hata olustu');
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: number) => {
    const res = await adminApi.deleteUser(id);
    if (res.success) {
      toast.success('Kullanici silindi');
      fetchUsers();
    } else {
      toast.error(res.error || 'Hata olustu');
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Cinzel, serif' }}>Panel Kullanicilari</h1>

      <Card className="glass-card mb-6">
        <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="h-5 w-5" /> Yeni Kullanici</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label>Kullanici Adi</Label>
              <Input value={username} onChange={e => setUsername(e.target.value)} placeholder="Kullanici adi" />
            </div>
            <div className="space-y-2">
              <Label>Sifre</Label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Sifre" />
            </div>
            <div className="space-y-2">
              <Label>Yetki</Label>
              <Select value={permission} onValueChange={setPermission}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="support">Destek</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleCreate} disabled={submitting} className="w-full">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                Ekle
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> Kullanicilar</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : users.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Kullanici bulunamadi</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Kullanici Adi</TableHead>
                  <TableHead>Yetki</TableHead>
                  <TableHead>Olusturma Tarihi</TableHead>
                  <TableHead className="text-right">Islem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u: any) => (
                  <TableRow key={u.id}>
                    <TableCell>{u.id}</TableCell>
                    <TableCell>{u.username}</TableCell>
                    <TableCell>
                      <Badge variant={u.permission === 'admin' ? 'default' : 'secondary'}>
                        {u.permission === 'admin' ? 'Admin' : u.permission === 'moderator' ? 'Moderator' : 'Destek'}
                      </Badge>
                    </TableCell>
                    <TableCell>{u.created_at || '-'}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(u.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
