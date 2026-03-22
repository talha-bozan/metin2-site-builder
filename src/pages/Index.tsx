import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Wifi, WifiOff, Calendar, Newspaper, Swords, Users, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';

// Static data from DB
const banners = [
  { id: 1, image: 'https://gf3.geo.gfsrv.net/cdn85/73710b0e9893be93562199eaa5f21d.jpg', title: 'Simya Efsun Nesnesi nesne markette', content: 'Ejderha Taşı Simyası için tasarlanmış yeni efsun nesnesi ile simyalarızın efsununu değiştirip, yeniden dönüştürmüş gibi efsunlayabilirsiniz.' },
  { id: 2, image: 'https://gf2.geo.gfsrv.net/cdn78/26c8a254118d6bbbd8ae871744024e.jpg', title: 'Metin2 Nesne Marketi', content: 'Ejderhalara layık kampanya ürünleri' },
  { id: 3, image: 'https://gf3.geo.gfsrv.net/cdnbb/48143cd4b941ca5e7383049f1646f3.jpg', title: 'Hazine avcılarının dikkatine!', content: 'Şimdi Dükkan\'da gizemli Babil hazinesini keşfet ve nadir Grifon petler, ritüel taşları gibi ödüller kazan!' },
  { id: 4, image: 'https://gf3.geo.gfsrv.net/cdn5c/17d4dc6ce00fb6ae7cee2eb4dbf4d5.jpg', title: 'Noel şahane geçecek', content: 'Yepyeni etkinliklerle süslenmiş maceralara atıl. Tombala veya kader çarkında kazan!' },
];

const events = [
  { day: 'Pazartesi', name: 'Okey Etkinliği', time: '20:00-21:00' },
  { day: 'Salı', name: 'Sertifika Etkinliği', time: '20:00-21:00' },
  { day: 'Çarşamba', name: 'Futbol Topu Etkinliği', time: '20:00-21:00' },
  { day: 'Perşembe', name: 'Ayışığı Etkinliği', time: '20:00-21:00' },
  { day: 'Cuma', name: 'Dönüşüm Küresi Etkinliği', time: '20:00-21:00' },
  { day: 'Cumartesi', name: 'Beceri Kitabı Etkinliği', time: '20:00-21:00' },
  { day: 'Pazar', name: 'Ramazan Simit Etkinliği', time: '20:00-21:00' },
];

const channels = [
  { name: 'Kanal 1', port: 25000 },
  { name: 'Kanal 2', port: 25010 },
  { name: 'Kanal 3', port: 25020 },
  { name: 'Kanal 4', port: 25030 },
];

const todayIndex = new Date().getDay();
const dayNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
const todayName = dayNames[todayIndex];

export default function Index() {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setSlide((s) => (s + 1) % banners.length), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      {/* Hero Banner */}
      <section className="relative overflow-hidden">
        <div className="relative h-[340px] sm:h-[420px] lg:h-[480px]">
          {banners.map((b, i) => (
            <div
              key={b.id}
              className="absolute inset-0 transition-opacity duration-700"
              style={{ opacity: i === slide ? 1 : 0 }}
            >
              <img src={b.image} alt={b.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            </div>
          ))}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
            <div className="mx-auto max-w-7xl">
              <h2
                className="text-2xl font-bold sm:text-3xl lg:text-4xl text-foreground mb-2"
                style={{ fontFamily: 'Cinzel, serif', textWrap: 'balance', lineHeight: '1.1' }}
              >
                {banners[slide].title}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-xl" style={{ textWrap: 'pretty' }}>
                {banners[slide].content}
              </p>
            </div>
          </div>

          {/* Arrows */}
          <button
            onClick={() => setSlide((s) => (s - 1 + banners.length) % banners.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-background/60 p-2 text-foreground backdrop-blur transition-transform active:scale-95 hover:bg-background/80"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => setSlide((s) => (s + 1) % banners.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-background/60 p-2 text-foreground backdrop-blur transition-transform active:scale-95 hover:bg-background/80"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                className={`h-1.5 rounded-full transition-all ${i === slide ? 'w-6 bg-primary' : 'w-1.5 bg-muted-foreground/40'}`}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 space-y-10">
        {/* Quick Actions */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { icon: Swords, label: 'Nesne Marketi', desc: 'Kostüm, silah, zırh', to: '/market' },
            { icon: Zap, label: 'EP Yükle', desc: 'Dragon Coin satın al', to: '/ep-yukle' },
            { icon: Users, label: 'Kayıt Ol', desc: 'Maceraya başla', to: '/kayit' },
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
                <Wifi className="h-4 w-4 text-emerald-500" />
                Sunucu Durumu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {channels.map((ch) => (
                <div key={ch.name} className="flex items-center justify-between rounded-md bg-secondary/50 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-sm font-medium text-foreground">{ch.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground tabular-nums">Port {ch.port}</span>
                </div>
              ))}
              <div className="rounded-md bg-emerald-500/10 border border-emerald-500/20 p-2.5 text-center text-sm text-emerald-400 font-medium">
                Sunucu Çevrimiçi
              </div>
            </CardContent>
          </Card>

          {/* Events */}
          <Card className="glass-card lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base" style={{ fontFamily: 'Cinzel, serif' }}>
                <Calendar className="h-4 w-4 text-primary" />
                Haftalık Etkinlik Takvimi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1.5">
                {events.map((e) => {
                  const isToday = e.day === todayName;
                  return (
                    <div
                      key={e.day}
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
                            BUGÜN
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <section className="glass-card rounded-lg p-8 text-center glow-gold">
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Cinzel, serif', lineHeight: '1.1' }}>
            Efsaneye Katıl
          </h2>
          <p className="text-muted-foreground mb-5 max-w-md mx-auto text-sm" style={{ textWrap: 'pretty' }}>
            Hemen kayıt ol, karakterini oluştur ve Metin2 dünyasında yerini al. Binlerce oyuncu seni bekliyor.
          </p>
          <div className="flex justify-center gap-3">
            <Link to="/kayit">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/80 active:scale-[0.97] transition-transform">
                Kayıt Ol
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
