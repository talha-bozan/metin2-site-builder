

## Metin2 Web Sitesi - Uygulama Plani

### Ozet
PHP backend'iniz (`http://46.225.67.8/index`) uzerinden calisan MySQL veritabaniniza baglanan, karanlik/gotik temali kapsamli bir Metin2 web sitesi olusturulacak.

### Veritabani Yapisi (SQL'den cikarilan)
- **items** + **shop_menu**: Market sistemi (kategorili, 450+ urun)
- **settings**: Site ayarlari (oyun adi, logo, sosyal linkler, port bilgileri)
- **events**: Haftalik etkinlik takvimi
- **banner**: Slider gorselleri
- **ep_price**: EP fiyat listesi (Dragon Coin yukleme)
- **wiki**: Oyun ansiklopedisi (boss drop, sandik icerikleri)
- **tickets/ticket_status**: Destek merkezi
- **news**: Haberler/duyurular
- **index_biyolog/index_efsun**: Oyun bilgileri

### Teknik Yaklasim

Frontend, `http://46.225.67.8/index` adresindeki PHP API'ye fetch istekleri atacak. Bir API service katmani olusturulacak. CORS sorunlari yasanirsa PHP tarafinda header eklenmesi gerekecek.

### Olusturulacak Sayfalar ve Bilesenler

**1. Ana Sayfa (Index)**
- Karanlik/gotik Metin2 temasi (koyu arka plan, altin/kirmizi vurgular)
- Hero banner slider (banner tablosundan)
- Sunucu durumu (online/offline, kanal portlari)
- Haftalik etkinlik takvimi
- Haberler/duyurular bolumu
- Footer (sosyal medya linkleri, telif hakki)

**2. Navigasyon**
- Responsive navbar: Ana Sayfa, Market, Etkinlikler, Wiki, Destek, Kayit Ol, Giris Yap
- Mobil hamburger menu

**3. Giris/Kayit Sistemi**
- Giris formu (kullanici adi + sifre) -> PHP API'ye POST
- Kayit formu (kullanici adi, sifre, email) -> PHP API'ye POST
- Session yonetimi (localStorage token)

**4. Nesne Marketi (Item Shop)**
- Sol sidebar: Kategori menusu (shop_menu tablosu, hiyerarsik yapi: Kusanma > Silahlar PvP, Zirhlar PvM vs.)
- Urun grid/listesi: Item gorseli, adi, fiyat (coins), aciklama
- Item detay modal: Efsun degerleri, socket bilgileri, adet secimi
- Satin alma islemi -> PHP API'ye POST (kullanici hesabindan coins dusme)
- Filtreleme ve arama

**5. EP (Dragon Coin) Yukleme**
- EP paket listesi (ep_price tablosu: 30EP=10TL, 60EP=20TL...)
- Odeme yontemleri (PayTR, PayWant, KasaGame, ItemCI vs.)
- Odeme gecmisi

**6. Etkinlik Takvimi**
- Haftalik etkinlik tablosu (events tablosu)
- Aktif/yaklasmakta olan etkinlik gosterimi

**7. Wiki/Ansiklopedi**
- Boss drop listeleri
- Sandik icerikleri
- Mob bilgileri

**8. Destek Merkezi**
- Ticket olusturma formu
- Ticket listesi ve durumu
- Ticket detay ve mesajlasma

**9. Kullanici Profili**
- EP bakiyesi, karakter bilgileri
- Satin alma gecmisi
- Hesap ayarlari

### Dosya Yapisi

```text
src/
  api/
    client.ts          # Base API client (fetch wrapper for PHP backend)
    auth.ts            # Login/register/session API calls
    shop.ts            # Market items, categories, purchase
    events.ts          # Events data
    wiki.ts            # Wiki data
    tickets.ts         # Support ticket API
    ep.ts              # EP pricing and payment
  components/
    layout/
      Navbar.tsx       # Dark themed navigation
      Footer.tsx       # Social links, copyright
      Layout.tsx       # Wrapper with navbar+footer
    home/
      HeroBanner.tsx   # Image slider
      ServerStatus.tsx # Online status widget
      EventCalendar.tsx
      NewsSection.tsx
    shop/
      CategorySidebar.tsx
      ItemGrid.tsx
      ItemCard.tsx
      ItemDetailModal.tsx
      PurchaseDialog.tsx
    auth/
      LoginForm.tsx
      RegisterForm.tsx
    profile/
      ProfilePage.tsx
      PurchaseHistory.tsx
    support/
      TicketForm.tsx
      TicketList.tsx
    wiki/
      WikiPage.tsx
  contexts/
    AuthContext.tsx     # User session state
  pages/
    Index.tsx
    Shop.tsx
    Login.tsx
    Register.tsx
    Profile.tsx
    Events.tsx
    Wiki.tsx
    Support.tsx
    EPYukle.tsx
  lib/
    utils.ts
```

### Tema/Tasarim
- Arka plan: Koyu siyah-gri gradient, Metin2 tarzinda doku/pattern
- Ana renkler: Altin (#C5A55A), Koyu kirmizi (#8B0000), koyu mor vurgular
- Font: Serif basliklar (oyun hissi), sans-serif govde metni
- Butonlar: Altin kenarlikli, hover'da parlama efekti
- Kartlar: Yari seffaf koyu arka plan, altin border

### Uygulama Sirasi
1. Tema ve layout (Navbar, Footer, dark theme CSS)
2. API service katmani (PHP backend baglantisi)
3. Ana sayfa (banner, sunucu durumu, etkinlikler)
4. Giris/Kayit sistemi + AuthContext
5. Nesne Marketi (kategoriler, urunler, satin alma)
6. EP Yukleme sayfasi
7. Destek merkezi
8. Wiki/Ansiklopedi
9. Kullanici profili

### Onemli Notlar
- PHP backend'inizin CORS header'lari desteklemesi gerekecek (`Access-Control-Allow-Origin: *`)
- API endpoint yapilarini bilmedigim icin, once genel bir yapi olusturacagim; endpoint URL'lerini sonra kolayca degistirebilirsiniz
- Sifre hashleme ve guvenlik PHP tarafinda yapilacak; frontend sadece istek atar

