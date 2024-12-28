const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend')));

// MongoDB bağlantısı
mongoose.connect('mongodb+srv://emir123emir:Emir123Emir@cyberweb.xivul.mongodb.net/CyberWeb?retryWrites=true&w=majority&appName=CyberWeb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB bağlantısı başarılı.'))
.catch(err => console.error('MongoDB bağlantı hatası:', err.message));

// Rotalar
app.use('/api/auth', authRoutes);

// Sunucuyu başlat
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});
