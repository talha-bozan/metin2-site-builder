import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, HardDrive, Loader2, Package } from 'lucide-react';
import { generalApi, Pack } from '@/api/general';

export default function Downloads() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generalApi.getPacks().then(res => {
      if (res.success && res.data) setPacks(Array.isArray(res.data) ? res.data : []);
      setLoading(false);
    });
  }, []);

  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ fontFamily: 'Cinzel, serif', lineHeight: '1.1' }}>
          <Download className="h-6 w-6 text-primary" />
          Oyun Indirme
        </h1>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
        ) : packs.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="flex flex-col items-center py-12 text-muted-foreground">
              <Package className="h-12 w-12 mb-3 opacity-40" />
              <p className="text-sm">Indirme paketi bulunamadi</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {packs.map(pack => (
              <Card key={pack.id} className="glass-card glow-gold-hover hover:border-primary/30 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    {pack.image ? (
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-secondary/60 overflow-hidden">
                        <img src={pack.image} alt={pack.name} className="h-12 w-12 object-contain" />
                      </div>
                    ) : (
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Package className="h-8 w-8 text-primary" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-foreground" style={{ fontFamily: 'Cinzel, serif' }}>
                        {pack.name}
                      </h3>
                      {pack.size && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                          <HardDrive className="h-3.5 w-3.5" />
                          {pack.size}
                        </p>
                      )}
                    </div>
                    <a href={pack.url} target="_blank" rel="noopener noreferrer">
                      <Button className="gap-2 active:scale-[0.97] transition-transform">
                        <Download className="h-4 w-4" />
                        Indir
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
