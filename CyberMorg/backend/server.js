const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path'); // Yeni eklendi
const User = require('./models/User');
const News = require('./models/News');
const scrapeNews = require('./scrapers/newsScraper');
const authRoutes = require('./routes/auth');
const newsRoutes = require('./routes/news');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Statik dosyalar için
app.use(express.static(path.join(__dirname, '../frontend'))); // Frontend dosyaları için
app.use(express.static('frontend'));

// CORS ayarları
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);

// Database bağlantısı
connectDB().then(() => {
    console.log('MongoDB bağlantısı başarılı');
}).catch(err => {
    console.error('MongoDB bağlantı hatası:', err);
});

// Ana sayfa route'u
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/index.html'));
});

// Login ve Register sayfaları için route'lar
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/register.html'));
});

// Diğer sayfalar için route'lar
app.get('/news', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/news.html'));
});

app.get('/forum', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/forum.html'));
});

app.get('/education', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/education.html'));
});

// Mevcut API route'ları buraya...
// [Diğer kodlar aynı kalacak]

// Statik dosyalar için yolları ayarla
app.use('/images', express.static(path.join(__dirname, '../frontend/public/images')));
app.use(express.static(path.join(__dirname, '../frontend')));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server ${PORT} portunda çalışıyor`));