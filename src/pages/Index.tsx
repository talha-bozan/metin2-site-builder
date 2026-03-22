import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Wifi, WifiOff, Calendar, Newspaper, Swords, Users, Zap, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { generalApi, Banner, ServerStatus } from '@/api/general';
import { eventsApi } from '@/api/events';

const dayNames = ['Pazar', 'Pazartesi', 'Sali', 'Carsamba', 'Persembe', 'Cuma', 'Cumartesi'];
const todayName = dayNames[new Date().getDay()];

export default function Index() {
  const [slide, setSlide] = useState(0);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [bRes, eRes, sRes] = await Promise.all([
        generalApi.getBanners(),
        eventsApi.getEvents(),
        generalApi.getServerStatus(),
      ]);
      if (bRes.success && bRes.data) setBanners(Array.isArray(bRes.data) ? bRes.data : []);
      if (eRes.success && eRes.data) setEvents(Array.isArray(eRes.data) ? eRes.data : []);
      if (sRes.success && sRes.data) setServerStatus(sRes.data as any);
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    if (banners.length === 0) return;
    const interval = setInterval(() => setSlide((s) => (s + 1) % banners.length), 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const fallbackBanners = banners.length > 0 ? banners : [
    { id: 1, image: '', title: 'Metin2 Server', content: 'En iyi Metin2 deneyimi', type: '' },
  ];

  const channels = serverStatus?.channels || [];
  const isOnline = serverStatus?.online || false;

  return (
    <Layout>
      {/* Hero Banner */}
      <section className="relative overflow-hidden">
        <div className="relative h-[340px] sm:h-[420px] lg:h-[480px]">
          {fallbackBanners.map((b, i) => (
            <div
              key={b.id}
              className="absolute inset-0 transition-opacity duration-700"
              style={{ opacity: i === slide ? 1 : 0 }}
            >
              {b.image ? (
                <img src={b.image} alt={b.title} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-primary/20 to-background" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            </div>
          ))}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
            <div className="mx-auto max-w-7xl">
              <h2
                className="text-2xl font-bold sm:text-3xl lg:text-4xl text-foreground mb-2"
                style={{ fontFamily: 'Cinzel, serif', textWrap: 'balance', lineHeight: '1.1' }}
              >
                {fallbackBanners[slide]?.title}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-xl" style={{ textWrap: 'pretty' }}>
                {fallbackBanners[slide]?.content}
              </p>
            </div>
          </div>

          {fallbackBanners.length > 1 && (
            <>
              <button
                onClick={() => setSlide((s) => (s - 1 + fallbackBanners.length) % fallbackBanners.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-background/60 p-2 text-foreground backdrop-blur transition-transform active:scale-95 hover:bg-background/80"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setSlide((s) => (s + 1) % fallbackBanners.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-background/60 p-2 text-foreground backdrop-blur transition-transform active:scale-95 hover:bg-background/80"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                {fallbackBanners.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSlide(i)}
                    className={`h-1.5 rounded-full transition-all ${i === slide ? 'w-6 bg-primary' : 'w-1.5 bg-muted-foreground/40'}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 space-y-10">
        {/* Quick Actions */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { icon: Swords, label: 'Nesne Marketi', desc: 'Kostum, silah, zirh', to: '/market' },
            { icon: Zap, label: 'EP Yukle', desc: 'Dragon Coin satin al', to: '/ep-yukle' },
            { icon: Users, label: 'Kayit Ol', desc: 'Maceraya basla', to: '/kayit' },
            { icon: Newspaper, label: 'Wiki', desc: 'Oyun rehberi', to: '/wiki' },
          ].map((a) => (
            <Link key={a.to} to={a.to}>
              <Card className="group glass-card transition-all hover:border-primary/40 glow-gold-hover cursor-pointer">
                <CardContent className="flex flex-col items-center gap-2 p-5 text-center">
                  <a.icon className="h-7 w-7 text-primary transition-transform group-hover:scale-110 group-active:scale-95" />
                  <span className="text-sm font-semibold text-foreground">{a.label}</span>
                  <span className="text-xs text-muted-foreground">{a.desc}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Server Status */}
          <Card className="glass-card lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base" style={{ fontFamily: 'Cinzel, serif' }}>
                {isOnline ? <Wifi className="h-4 w-4 text-emerald-500" /> : <WifiOff className="h-4 w-4 text-red-500" />}
                Sunucu Durumu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {loading ? (
                <div className="flex justify-center py-4"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
              ) : channels.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">Kanal bilgisi alinamadi</p>
              ) : (
                <>
                  {channels.map((ch: any) => (
                    <div key={ch.name} className="flex items-center justify-between rounded-md bg-secondary/50 px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${ch.status ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                        <span className="text-sm font-medium text-foreground">{ch.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground tabular-nums">Port {ch.port}</span>
                    </div>
                  ))}
                  <div className={`rounded-md ${isOnline ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'} border p-2.5 text-center text-sm font-medium`}>
                    {isOnline ? 'Sunucu Cevrimici' : 'Sunucu Cevrimdisi'}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Events */}
          <Card className="glass-card lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base" style={{ fontFamily: 'Cinzel, serif' }}>
                <Calendar className="h-4 w-4 text-primary" />
                Haftalik Etkinlik Takvimi
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-4"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
              ) : (
                <div className="space-y-1.5">
                  {events.map((e: any) => {
                    const isToday = e.day === todayName;
                    return (
                      <div
                        key={e.day || e.id}
                        className={`flex items-center justify-between rounded-md px-3 py-2.5 transition-colors ${
                          isToday ? 'bg-primary/10 border border-primary/20' : 'bg-secondary/30'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-20 text-xs font-semibold ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>
                            {e.day}
                          </span>
                          <span className={`text-sm ${isToday ? 'text-foreground font-medium' : 'text-foreground/80'}`}>
                            {e.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground tabular-nums">{e.time}</span>
                          {isToday && (
                            <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary">
                              BUGUN
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <section className="glass-card rounded-lg p-8 text-center glow-gold">
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Cinzel, serif', lineHeight: '1.1' }}>
            Efsaneye Katil
          </h2>
          <p className="text-muted-foreground mb-5 max-w-md mx-auto text-sm" style={{ textWrap: 'pretty' }}>
            Hemen kayit ol, karakterini olustur ve Metin2 dunyasinda yerini al. Binlerce oyuncu seni bekliyor.
          </p>
          <div className="flex justify-center gap-3">
            <Link to="/kayit">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/80 active:scale-[0.97] transition-transform">
                Kayit Ol
              </Button>
            </Link>
            <Link to="/market">
              <Button variant="outline" className="border-primary/40 text-primary hover:bg-primary/10 active:scale-[0.97] transition-transform">
                Markete Git
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}
