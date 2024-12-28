const axios = require('axios');
const mongoose = require('mongoose');
const CyberHaber = require('./models/CyberHaber'); // Modelinizi doğru şekilde dahil edin

const MONGODB_URI = 'mongodb+srv://emir123emir:Emir123Emir@cyberweb.xivul.mongodb.net/CyberWeb?retryWrites=true&w=majority';
const NEWS_API_KEY = 'f4c257ceb3f4427da7890f7cfcc853aa';  // Verdiğiniz API Anahtarı

// MongoDB bağlantısı
async function connectDB() {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB bağlantısı başarılı.');
    } catch (err) {
        console.error('MongoDB bağlantı hatası:', err.message);
        process.exit(1);  // Hata durumunda işlemi sonlandır
    }
}

// NewsAPI'den haber çekme
async function scrapeNewsAPI() {
    try {
        // NewsAPI'den haberleri çekmek için API isteği gönderiyoruz
        const response = await axios.get('https://newsapi.org/v2/everything', {
            params: {
                q: 'cyber security',  // Arama terimi
                apiKey: NEWS_API_KEY,  // API anahtarınız
                pageSize: 20,  // Çekilecek haber sayısını arttırdık
                language: 'en',  // Dili İngilizce yapalım
                sortBy: 'publishedAt',  // Yayınlanma tarihine göre sıralama
            }
        });

        const articles = response.data.articles.map(item => ({
            title: item.title,
            link: item.url,
            description: item.description,
            image: item.urlToImage,
            publishedAt: item.publishedAt
        }));

        console.log(`Toplam ${articles.length} makale bulundu.`);

        // Verileri MongoDB'ye kaydedelim
        for (const article of articles) {
            try {
                await CyberHaber.findOneAndUpdate(
                    { link: article.link },  // Aynı linkte varsa güncelle
                    article,  // Yeni veriyi kaydet
                    { upsert: true, new: true }  // Eğer yoksa ekle
                );
                console.log(`Makale kaydedildi: ${article.title}`);
            } catch (err) {
                console.error(`Makale kaydedilirken hata: ${err.message}`);
            }
        }
    } catch (err) {
        console.error('NewsAPI veri çekme hatası:', err.message);
    }
}

// Ana fonksiyon
async function main() {
    await connectDB();  // MongoDB bağlantısını kur
    await scrapeNewsAPI();  // NewsAPI'den veri çek ve kaydet
    await mongoose.connection.close();  // MongoDB bağlantısını kapat
    console.log('MongoDB bağlantısı kapatıldı.');
}

// Çalıştırma
main().catch(err => console.error('Hata:', err));