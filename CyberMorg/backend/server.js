const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');
const forumRoutes = require('./routes/forum');
const newsRoutes = require('./routes/news');
const educationRoutes = require('./routes/education');
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// MongoDB bağlantısı
connectDB();

// Routes
app.use('/api/forum', forumRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);

// Statik dosya sunumu
app.use(express.static('frontend'));
app.use('/images', express.static(path.join(__dirname, '../frontend/public/images')));
app.use('/uploads', express.static(path.join(__dirname, '../frontend/uploads')));

// Ana route'lar
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/index.html'));
});

app.get('/forum', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/forum.html'));
});

app.get('/topic-detail', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/topic-detail.html'));
});

app.get('/news', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/news.html'));
});

app.get('/education', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/education.html'));
});

// Eğitim detay sayfası
app.get('/education/course', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/course-detail.html'));
});

// Eğitim oluşturma sayfası
app.get('/education/create', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/course-editor.html'));
});

// Eğitim düzenleme sayfası
app.get('/education/edit', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/course-editor.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/register.html'));
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/profile.html'));
});

app.get('/settings', (req, res) => {
    // Ayarlar sayfası henüz oluşturulmadığı için profile sayfasına yönlendir
    res.redirect('/profile');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor`);
    console.log('Forum route\'u aktif: /api/forum/topics');
    console.log('Haberler route\'u aktif: /api/news');
    console.log('Eğitim route\'u aktif: /api/education');
    console.log('Kimlik doğrulama route\'u aktif: /api/auth');
    console.log('Dosya yükleme route\'u aktif: /api/upload');
});