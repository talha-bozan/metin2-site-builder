import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ShoppingCart, LifeBuoy, Coins, Loader2 } from 'lucide-react';
import { adminApi } from '@/api/admin';

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getDashboard().then(res => {
      if (res.success && res.data) setData(res.data);
      setLoading(false);
    });
  }, []);

  const stats = [
    { label: 'Toplam Hesap', value: data?.total_accounts ?? 0, icon: Users, color: 'text-blue-500' },
    { label: 'Acik Ticket', value: data?.open_tickets ?? 0, icon: LifeBuoy, color: 'text-yellow-500' },
    { label: 'Toplam Satis', value: data?.total_sales ?? 0, icon: ShoppingCart, color: 'text-green-500' },
    { label: 'Toplam Gelir', value: `${data?.total_revenue ?? 0} DC`, icon: Coins, color: 'text-primary' },
  ];

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Cinzel, serif' }}>Dashboard</h1>
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(s => (
            <Card key={s.label} className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{typeof s.value === 'number' ? s.value.toLocaleString() : s.value}</p>
                  </div>
                  <s.icon className={`h-8 w-8 ${s.color} opacity-80`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
