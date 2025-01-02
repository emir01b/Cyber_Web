const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');
const forumRoutes = require('./routes/forum');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// MongoDB bağlantısı
connectDB();

// Routes
app.use('/api/forum', forumRoutes);

// Statik dosya sunumu
app.use(express.static('frontend'));
app.use('/images', express.static(path.join(__dirname, '../frontend/public/images')));

// Ana route'lar
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/index.html'));
});

app.get('/forum', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/forum.html'));
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor`);
    console.log('Forum route\'u aktif: /api/forum/topics');
});