const express = require('express');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const router = express.Router();

// E-posta gönderim ayarları
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'cybermorg23@gmail.com',
        pass: 'xwb3 22nr 2drk f5mu 6i3d 53cv c6fo 3orw' // Gmail Uygulama Şifresi buraya gelecek
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Kayıt olma
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    console.log('Kayıt isteği alındı:', req.body);

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    try {
        // Önce e-posta kontrolü
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Bu e-posta ile kayıtlı bir kullanıcı var.' });
        }

        const newUser = new User({ username, email, password, verificationCode });
        await newUser.save();

        // E-posta gönderme
        await transporter.sendMail({
            from: 'your-email@gmail.com',
            to: email,
            subject: 'Doğrulama Kodu',
            text: `Doğrulama kodunuz: ${verificationCode}`
        });

        res.status(200).json({ message: 'Kayıt başarılı! Doğrulama kodu e-posta ile gönderildi.' });
    } catch (error) {
        console.error('Kayıt hatası:', error);
        res.status(500).json({ error: error.message });
    }
});

// Doğrulama kodunu kontrol etme
router.post('/verify', async (req, res) => {
    const { email, verificationCode } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
        }

        if (user.verificationCode === verificationCode) {
            user.isVerified = true;
            user.verificationCode = undefined; // Doğrulama kodunu temizle
            await user.save();
            res.status(200).json({ message: 'Kullanıcı doğrulandı!' });
        } else {
            res.status(400).json({ message: 'Geçersiz doğrulama kodu.' });
        }
    } catch (error) {
        console.error('Hata:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;