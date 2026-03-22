import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Skull } from 'lucide-react';

const wikiEntries = [
  { id: 1, title: 'Kırmızı Ejderha', content: 'Kırmızı Ejderha Yongbi Çölünde 4 Saat Ara İle Çıkmaktadır.', image: '🐉', drops: ['Ejderha Taşı', 'Ruhtaşı', 'Metin Taşı+4'] },
  { id: 2, title: 'Katakomp Azraili', content: 'Katakomp Azraili Muhtemelen Düşebilicek Eşyalar.', image: '💀', drops: ['Yıldırım Ayakkabısı', 'Oniks Yüzük', 'Becerikli Kolye'] },
  { id: 4, title: 'Nemere', content: 'Nemere Bossu 1 Saat Ara İle çıkmaktadır.', image: '❄️', drops: ['Buz Kılıcı', 'Nemere Zırhı', 'Ejderha Taşı'] },
  { id: 5, title: 'Örümcek Barones', content: 'Şeytan Kulesi Önünde 1 Saat Ara İle Çıkmaktadır.', image: '🕷️', drops: ['Örümcek Zırhı', 'Karanlık Kılıç', 'Beceri Kitabı'] },
  { id: 6, title: 'Azrail', content: 'Şeytan Kulesi Son Katında Çıkmaktadır.', image: '👹', drops: ['Azrail Kılıcı', 'Ruhtaşı+3', 'Yıldırım Takısı'] },
  { id: 7, title: 'Jeon-un Metini', content: 'Kızıl Orman Bölgelerinde Çıkmaktadır.', image: '🪨', drops: ['PvP Silahları', 'Ejderha Taşı', 'Simya Taşı'] },
  { id: 8, title: 'Tu-Young Metini', content: 'Kızıl Orman Bölgelerinde Çıkmaktadır.', image: '🪨', drops: ['PvM Zırhları', 'Beceri Kitabı', 'Metin Taşı'] },
];

export default function Wiki() {
  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ fontFamily: 'Cinzel, serif', lineHeight: '1.1' }}>
          <BookOpen className="h-6 w-6 text-primary" />
          Wiki — Boss & Metin Drop Rehberi
        </h1>
        <div className="grid gap-4 sm:grid-cols-2">
          {wikiEntries.map((entry) => (
            <Card key={entry.id} className="glass-card transition-all glow-gold-hover hover:border-primary/30">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary/60 text-2xl">
                    {entry.image}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-foreground" style={{ fontFamily: 'Cinzel, serif' }}>
                      {entry.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{entry.content}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {entry.drops.map((d) => (
                        <span key={d} className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary font-medium">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
