# ⚽ VARAI — Futbol Pozisyon Analiz Uygulaması

Futbol maçı kliplerini yükleyin veya YouTube linki girin; yapay zeka hakem gibi analiz etsin.

---

## 🎯 Özellikler

- 📁 **Video Yükleme** — Sürükle-bırak veya dosya seç (MP4, MOV, AVI, WebM)
- ▶️ **YouTube Linki** — YouTube URL'si yapıştır, thumbnail anında önizle
- 🤖 **AI Analizi** — Faul, penaltı, ofsayt ve kart kararları
- 📋 **Hakem Yorumu** — FIFA kurallarına dayalı ayrıntılı VAR raporu
- ⏱️ **Timeline** — Videonun önemli anlarına tıklayarak atla
- 📤 **Paylaş & İndir** — Sonuçları metin olarak kopyala veya JSON indir

---

## 🚀 Kurulum

### Gereksinimler
- [Node.js](https://nodejs.org/) v18 veya üstü
- npm

### Adımlar

```bash
# 1. Repoyu klonla
git clone https://github.com/enwsbayar/varai.git
cd varai

# 2. Bağımlılıkları yükle
npm install

# 3. Geliştirme sunucusunu başlat
npm run dev
```

Tarayıcıda **http://localhost:5173** adresini aç.

---

## 🏗️ Proje Yapısı

```
src/
├── pages/
│   ├── Home.jsx          # Ana sayfa
│   ├── Upload.jsx        # Video yükleme (dosya + YouTube)
│   └── Analysis.jsx      # Analiz sonuçları
├── components/
│   └── Navbar.jsx
└── services/
    └── aiAnalysis.js     # AI analiz servisi (mock → Gemini'ye hazır)
```

---

## 🤖 AI Entegrasyonu

Şu an uygulama **simüle edilmiş** (mock) bir AI servisi kullanmaktadır.  
Gerçek bir AI entegrasyonu için önerilen çözüm **Google Gemini Video API**'dir:

- YouTube linklerini doğrudan analiz edebilir (indirme gerekmez)
- Video dosyalarını frame frame işleyebilir
- FIFA kurallarına göre hakem yorumu üretebilir

Gerçek entegrasyon için `src/services/aiAnalysis.js` içindeki fonksiyonları bir backend endpoint'ine bağlayın.

---

## 🛠️ Teknolojiler

| Katman | Teknoloji |
|--------|-----------|
| Framework | React 18 + Vite |
| Routing | React Router v6 |
| Stil | Vanilla CSS (özel dark mode) |
| İkonlar | Lucide React |
| Font | Inter + Bebas Neue (Google Fonts) |

---

