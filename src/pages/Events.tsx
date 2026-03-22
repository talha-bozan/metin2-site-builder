import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

const events = [
  { day: 'Pazartesi', name: 'Okey Etkinliği', time: '20:00-21:00' },
  { day: 'Salı', name: 'Sertifika Etkinliği', time: '20:00-21:00' },
  { day: 'Çarşamba', name: 'Futbol Topu Etkinliği', time: '20:00-21:00' },
  { day: 'Perşembe', name: 'Ayışığı Etkinliği', time: '20:00-21:00' },
  { day: 'Cuma', name: 'Dönüşüm Küresi Etkinliği', time: '20:00-21:00' },
  { day: 'Cumartesi', name: 'Beceri Kitabı Etkinliği', time: '20:00-21:00' },
  { day: 'Pazar', name: 'Ramazan Simit Etkinliği', time: '20:00-21:00' },
];

const dayNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
const todayName = dayNames[new Date().getDay()];

export default function Events() {
  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ fontFamily: 'Cinzel, serif', lineHeight: '1.1' }}>
          <Calendar className="h-6 w-6 text-primary" />
          Haftalık Etkinlik Takvimi
        </h1>
        <Card className="glass-card">
          <CardContent className="p-4 space-y-2">
            {events.map((e) => {
              const isToday = e.day === todayName;
              return (
                <div
                  key={e.day}
                  className={`flex items-center justify-between rounded-lg px-4 py-4 transition-colors ${
                    isToday ? 'bg-primary/10 border border-primary/20 glow-gold' : 'bg-secondary/30'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-24 text-sm font-semibold ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>
                      {e.day}
                    </span>
                    <span className={`text-sm ${isToday ? 'text-foreground font-semibold' : 'text-foreground/80'}`}>
                      {e.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground tabular-nums">{e.time}</span>
                    {isToday && (
                      <span className="rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-bold text-primary">
                        BUGÜN
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
