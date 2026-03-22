import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Loader2 } from 'lucide-react';
import { wikiApi } from '@/api/wiki';

export default function Wiki() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    wikiApi.getEntries().then(res => {
      if (res.success && res.data) setEntries(Array.isArray(res.data) ? res.data : []);
      setLoading(false);
    });
  }, []);

  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ fontFamily: 'Cinzel, serif', lineHeight: '1.1' }}>
          <BookOpen className="h-6 w-6 text-primary" />
          Wiki — Boss & Metin Drop Rehberi
        </h1>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : entries.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-12">Wiki girisi bulunamadi</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {entries.map((entry: any) => {
              const drops = entry.item ? (typeof entry.item === 'string' ? entry.item.split(',').map((s: string) => s.trim()).filter(Boolean) : []) : [];
              return (
                <Card key={entry.id} className="glass-card transition-all glow-gold-hover hover:border-primary/30">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary/60 text-2xl">
                        {entry.image && entry.image.startsWith('http') ? (
                          <img src={entry.image} alt={entry.title} className="h-10 w-10 object-contain" />
                        ) : entry.type === 'metin' ? '🪨' : '💀'}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-foreground" style={{ fontFamily: 'Cinzel, serif' }}>
                          {entry.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{entry.content}</p>
                        {drops.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {drops.map((d: string) => (
                              <span key={d} className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary font-medium">
                                {d}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
