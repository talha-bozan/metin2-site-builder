import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/50 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-3">
              <Shield className="h-6 w-6 text-gold" />
              <span className="text-lg font-bold text-gold" style={{ fontFamily: 'Cinzel, serif' }}>METIN2</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Türkiye'nin en büyük Metin2 özel sunucusu. Efsanevi macerana şimdi başla!
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3" style={{ fontFamily: 'Cinzel, serif' }}>Hızlı Bağlantılar</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/market" className="hover:text-gold transition-colors">Nesne Marketi</Link></li>
              <li><Link to="/ep-yukle" className="hover:text-gold transition-colors">EP Yükle</Link></li>
              <li><Link to="/etkinlikler" className="hover:text-gold transition-colors">Etkinlikler</Link></li>
              <li><Link to="/wiki" className="hover:text-gold transition-colors">Wiki</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3" style={{ fontFamily: 'Cinzel, serif' }}>Destek</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/destek" className="hover:text-gold transition-colors">Destek Merkezi</Link></li>
              <li><Link to="/kayit" className="hover:text-gold transition-colors">Kayıt Ol</Link></li>
            </ul>
          </div>

          {/* Server Info */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3" style={{ fontFamily: 'Cinzel, serif' }}>Sunucu Bilgileri</h4>
            <div className="space-y-1.5 text-sm text-muted-foreground">
              <p>Kanal 1: Port 25000</p>
              <p>Kanal 2: Port 25010</p>
              <p>Kanal 3: Port 25020</p>
              <p>Kanal 4: Port 25030</p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border/50 pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Metin2 — Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
}
