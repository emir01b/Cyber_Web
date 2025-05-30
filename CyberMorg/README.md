# 🛡️ CyberMorg - Siber Güvenlik Platformu

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-18.x%20|%2020.x-green.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-Web-lightgrey.svg)

CyberMorg, siber güvenlik dünyasında güncel kalmak isteyen profesyoneller ve meraklılar için kapsamlı bir bilgi paylaşım platformudur. Modern web teknolojileri kullanılarak geliştirilmiş bu platform, haberler, forum, eğitim materyalleri ve daha fazlasını bir araya getiriyor.

## 🌟 Özellikler

### 📰 Haberler
- Güncel siber güvenlik haberlerini takip edin
- Güvenlik açıkları ve güncellemeler hakkında bilgi edinin
- Otomatik haber scraping sistemi

### 💬 Forum
- Topluluk ile etkileşim kurun
- Sorular sorun ve deneyimlerinizi paylaşın
- Konu bazlı tartışmalar
- Yorum sistemi

### 🎓 Eğitim
- Kapsamlı siber güvenlik eğitim materyalleri
- İnteraktif kurs editörü
- Eğitim içeriği oluşturma ve düzenleme
- Popüler eğitimleri keşfedin

### 👤 Kullanıcı Yönetimi
- Güvenli kimlik doğrulama sistemi
- Kullanıcı profil yönetimi
- JWT tabanlı oturum yönetimi
- Dosya yükleme özellikleri

### 📊 İstatistikler
- Platform kullanım istatistikleri
- Gerçek zamanlı veri gösterimi
- Kullanıcı, haber, forum ve eğitim sayaçları

## 🚀 Teknoloji Stack'i

### Backend
- **Node.js** (18.x || 20.x) - Server-side JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL veritabanı
- **Mongoose** - MongoDB object modeling
- **JWT** - Token tabanlı kimlik doğrulama
- **bcrypt** - Şifre hashleme
- **Multer** - Dosya yükleme
- **Axios** - HTTP istekleri
- **Nodemailer** - Email gönderimi
- **CORS** - Cross-origin resource sharing

### Frontend
- **HTML5** - Markup language
- **CSS3** - Styling ve responsive design
- **JavaScript (ES6+)** - Client-side programming
- **Font Awesome** - İkon kütüphanesi

### DevOps & Tools
- **Docker** - Containerization
- **Nodemon** - Development server
- **Live Server** - Frontend development server

## 📁 Proje Yapısı

```
CyberMorg/
├── backend/                    # Backend API servisi
│   ├── config/                # Konfigürasyon dosyaları
│   │   └── db.js              # MongoDB bağlantı konfigürasyonu
│   ├── middleware/            # Express middleware'leri
│   ├── models/                # MongoDB veri modelleri
│   │   ├── User.js           # Kullanıcı modeli
│   │   ├── News.js           # Haber modeli
│   │   ├── Topic.js          # Forum konu modeli
│   │   ├── Comment.js        # Yorum modeli
│   │   ├── Course.js         # Kurs modeli
│   │   └── Education.js      # Eğitim modeli
│   ├── routes/               # API route'ları
│   │   ├── auth.js          # Kimlik doğrulama endpoint'leri
│   │   ├── news.js          # Haber API'leri
│   │   ├── forum.js         # Forum API'leri
│   │   ├── education.js     # Eğitim API'leri
│   │   └── upload.js        # Dosya yükleme API'leri
│   ├── scrapers/            # Web scraping araçları
│   │   └── newsScraper.js   # Haber scraper'ı
│   ├── services/            # Business logic servisleri
│   ├── package.json         # Backend dependencies
│   └── server.js            # Ana server dosyası
├── frontend/                # Frontend uygulaması
│   ├── css/                 # Stil dosyaları
│   ├── js/                  # JavaScript dosyaları
│   ├── public/              # Statik dosyalar
│   ├── uploads/             # Yüklenen dosyalar
│   ├── views/               # HTML sayfaları
│   │   ├── index.html       # Ana sayfa
│   │   ├── login.html       # Giriş sayfası
│   │   ├── register.html    # Kayıt sayfası
│   │   ├── forum.html       # Forum sayfası
│   │   ├── news.html        # Haberler sayfası
│   │   ├── education.html   # Eğitim sayfası
│   │   └── profile.html     # Profil sayfası
│   └── package.json         # Frontend dependencies
├── Dockerfile               # Docker konfigürasyonu
├── .dockerignore           # Docker ignore dosyası
├── .gitignore              # Git ignore dosyası
├── .nvmrc                  # Node.js version specification
├── render.yaml             # Render.com deploy configuration
├── package.json            # Ana proje konfigürasyonu
└── README.md               # Proje dokümantasyonu
```

## ⚙️ Kurulum

### Gereksinimler
- Node.js (18.x veya 20.x)
- MongoDB
- npm veya yarn

### 1. Projeyi Klonlayın
```bash
git clone https://github.com/your-username/cybermorg.git
cd cybermorg
```

### 2. Environment Variables Oluşturun
Backend klasöründe `.env` dosyası oluşturun:
```env
MONGODB_URI=mongodb://localhost:27017/cybermorg
JWT_SECRET=your-super-secret-key
PORT=5001
NODE_ENV=development
```

### 3. Dependencies'leri Yükleyin
```bash
# Tüm dependencies'leri yükle
npm run install-all

# Veya ayrı ayrı:
npm run install-backend
npm run install-frontend
```

### 4. MongoDB'yi Başlatın
```bash
# MongoDB servisini başlatın (sistem kurulumuna göre değişir)
mongod
```

### 5. Uygulamayı Çalıştırın
```bash
# Development modunda çalıştır
npm run dev

# Production modunda çalıştır
npm start
```

Uygulama `http://localhost:5001` adresinde çalışacaktır.

## 🚀 Render.com'a Deploy

### 1. GitHub Repository Oluşturun
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Render.com'da Yeni Servis Oluşturun
1. [Render.com](https://render.com) hesabınıza giriş yapın
2. "New" > "Web Service" seçin
3. GitHub repository'nizi bağlayın
4. Aşağıdaki ayarları yapın:
   - **Build Command**: `npm run install-all`
   - **Start Command**: `npm start`
   - **Node Version**: 20.18.0

### 3. Environment Variables Ekleyin
Render.com panelinde aşağıdaki environment variable'ları ekleyin:
```
MONGODB_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=production
PORT=5001
```

### 4. MongoDB Atlas Kurulumu
1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) hesabı oluşturun
2. Yeni cluster oluşturun (free tier)
3. Database user oluşturun
4. IP whitelist'e `0.0.0.0/0` ekleyin (production'da daha spesifik olmalı)
5. Connection string'i kopyalayıp `MONGODB_URI` olarak ekleyin

## 🐳 Docker ile Çalıştırma

### Docker Build
```bash
docker build -t cybermorg .
```

### Docker Run
```bash
docker run -p 5001:5001 \
  -e MONGODB_URI=your-mongodb-uri \
  -e JWT_SECRET=your-jwt-secret \
  cybermorg
```

## 📚 API Dokümantasyonu

### Authentication Endpoints
- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `GET /api/auth/profile` - Kullanıcı profili
- `PUT /api/auth/profile` - Profil güncelleme

### News Endpoints
- `GET /api/news` - Tüm haberleri getir
- `GET /api/news/:id` - Belirli bir haberi getir
- `POST /api/news` - Yeni haber ekle (Auth gerekli)

### Forum Endpoints
- `GET /api/forum/topics` - Forum konularını getir
- `GET /api/forum/topic/:id` - Belirli bir konuyu getir
- `POST /api/forum/topics` - Yeni konu oluştur (Auth gerekli)
- `POST /api/forum/comment` - Yorum ekle (Auth gerekli)

### Education Endpoints
- `GET /api/education/courses` - Tüm kursları getir
- `GET /api/education/course/:id` - Belirli bir kursu getir
- `POST /api/education/courses` - Yeni kurs oluştur (Auth gerekli)
- `PUT /api/education/course/:id` - Kurs güncelle (Auth gerekli)

### Upload Endpoints
- `POST /api/upload/profile-image` - Profil resmi yükle
- `POST /api/upload/course-image` - Kurs resmi yükle

## 🎯 Kullanım

1. **Ana Sayfa**: Platform özelliklerine genel bakış ve güncel içerikleri görüntüle
2. **Kayıt/Giriş**: Hesap oluştur veya mevcut hesabınla giriş yap
3. **Haberler**: En son siber güvenlik haberlerini takip et
4. **Forum**: Topluluk ile etkileşime geç, soru sor ve cevapla
5. **Eğitim**: Siber güvenlik eğitimlerini incele ve yeni içerik oluştur
6. **Profil**: Kişisel bilgilerini ve ayarlarını yönet

## 🔧 Troubleshooting

### Common Issues

#### Mongoose Connection Error
```bash
# Eğer Mongoose bağlantı hatası alıyorsanız:
npm install mongoose@latest
```

#### Node.js Version Issues
```bash
# Node.js versiyonunu kontrol edin:
node --version

# Doğru versiyonu yüklemek için nvm kullanın:
nvm install 20.18.0
nvm use 20.18.0
```

#### Port Already in Use
```bash
# 5001 portu kullanılıyorsa:
lsof -ti:5001 | xargs kill -9
```

## 🤝 Katkıda Bulunma

1. Projeyi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın


## 👨‍💻 Geliştirici

**Emir** - [GitHub Profili](https://github.com/emir01b)

## 📞 İletişim

Proje hakkında sorularınız için:
- GitHub Issues: [Issues sayfası](https://github.com/emir01b/cybermorg/issues)
- Email: your-email@example.com

## 🚦 Durum

- ✅ Temel platform yapısı
- ✅ Kullanıcı kimlik doğrulama
- ✅ Haber sistemi
- ✅ Forum sistemi
- ✅ Eğitim sistemi
- ✅ Dosya yükleme
- ✅ Responsive tasarım
- ✅ Render.com deploy desteği
- 🔄 Haber scraping optimizasyonu


## ⭐ Yıldız Verin!

Bu proje size yardımcı olduysa, lütfen bir yıldız vererek destekleyin! ⭐

---

*CyberMorg ile siber güvenlik dünyasında bir adım önde olun!* 🛡️ 