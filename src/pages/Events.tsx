import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Loader2 } from 'lucide-react';
import { eventsApi } from '@/api/events';

const dayNames = ['Pazar', 'Pazartesi', 'Sali', 'Carsamba', 'Persembe', 'Cuma', 'Cumartesi'];
const todayName = dayNames[new Date().getDay()];

export default function Events() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventsApi.getEvents().then(res => {
      if (res.success && res.data) setEvents(Array.isArray(res.data) ? res.data : []);
      setLoading(false);
    });
  }, []);

  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ fontFamily: 'Cinzel, serif', lineHeight: '1.1' }}>
          <Calendar className="h-6 w-6 text-primary" />
          Haftalik Etkinlik Takvimi
        </h1>
        <Card className="glass-card">
          <CardContent className="p-4 space-y-2">
            {loading ? (
              <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : events.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Etkinlik bulunamadi</p>
            ) : (
              events.map((e: any) => {
                const isToday = e.day === todayName;
                return (
                  <div
                    key={e.day || e.id}
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
                          BUGUN
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
