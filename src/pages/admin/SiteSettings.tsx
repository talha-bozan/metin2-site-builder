import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Save, Loader2 } from 'lucide-react';
import { adminApi } from '@/api/admin';
import { toast } from 'sonner';

export default function SiteSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const res = await adminApi.getSettings();
      if (res.success && res.data) {
        if (Array.isArray(res.data)) {
          const obj: Record<string, string> = {};
          res.data.forEach((s: any) => { obj[s.key] = s.value; });
          setSettings(obj);
        } else {
          setSettings(res.data);
        }
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings(s => ({ ...s, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await adminApi.updateSettings(settings);
    if (res.success) {
      toast.success('Ayarlar kaydedildi');
    } else {
      toast.error(res.error || 'Hata olustu');
    }
    setSaving(false);
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Cinzel, serif' }}>Site Ayarlari</h1>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5" /> Ayarlar</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : Object.keys(settings).length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Ayar bulunamadi</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(settings).map(([key, value]) => (
                <div key={key} className="grid gap-2 sm:grid-cols-[200px_1fr] items-center">
                  <Label className="text-sm font-medium text-muted-foreground">{key}</Label>
                  <Input
                    value={value}
                    onChange={e => handleChange(key, e.target.value)}
                  />
                </div>
              ))}
              <div className="pt-4">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                  Kaydet
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
