const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');

// E-posta doğrulama kodlarını geçici olarak saklamak için
const verificationCodes = new Map();

// E-posta gönderme yapılandırması
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'cybermorg23@gmail.com', // Gmail hesabınız
        pass: 'pdpd bsjf lpcc lekj' // Gmail uygulama şifreniz
    }
});

// Kayıt için doğrulama kodu gönderme
router.post('/send-verification', async (req, res) => {
    try {
        const { email } = req.body;
        const verificationCode = Math.floor(100000 + Math.random() * 900000);
        
        const mailOptions = {
            from: 'your-email@gmail.com',
            to: email,
            subject: 'CyberMorg Doğrulama Kodu',
            text: `Doğrulama kodunuz: ${verificationCode}`
        };

        await transporter.sendMail(mailOptions);
        verificationCodes.set(email, {
            code: verificationCode.toString(),
            timestamp: Date.now()
        });

        res.json({ message: 'Doğrulama kodu gönderildi' });
    } catch (error) {
        res.status(500).json({ error: 'Doğrulama kodu gönderilemedi' });
    }
});

// Kullanıcı kaydı
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, verificationCode } = req.body;

        // Kullanıcı adı ve email kontrolü
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });

        if (existingUser) {
            return res.status(400).json({ 
                error: 'Bu e-posta veya kullanıcı adı zaten kullanımda' 
            });
        }

        // Doğrulama kodunu kontrol et
        const storedVerification = verificationCodes.get(email);
        if (!storedVerification || storedVerification.code !== verificationCode) {
            return res.status(400).json({ error: 'Geçersiz doğrulama kodu' });
        }

        // Kod 5 dakikadan eski mi kontrol et
        if (Date.now() - storedVerification.timestamp > 5 * 60 * 1000) {
            verificationCodes.delete(email); // Süresi geçmiş kodu sil
            return res.status(400).json({ error: 'Doğrulama kodu süresi dolmuş' });
        }

        // Şifreyi hashle
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Yeni kullanıcı oluştur
        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();
        verificationCodes.delete(email); // Başarılı kayıttan sonra kodu sil

        // Başarılı yanıt
        res.status(200).json({ 
            message: 'Kullanıcı başarıyla kaydedildi',
            user: {
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Kayıt hatası:', error); // Hata detayını logla
        res.status(500).json({ 
            error: 'Kayıt işlemi başarısız',
            details: error.message 
        });
    }
});

// Kullanıcı girişi
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // E-posta kontrolü
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Kullanıcı bulunamadı' });
        }

        // Şifre kontrolü
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Geçersiz şifre' });
        }

        // JWT token oluştur
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your-jwt-secret',
            { expiresIn: '1h' }
        );

        // Başarılı yanıt
        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Giriş hatası:', error); // Hatayı logla
        res.status(500).json({ error: 'Giriş işlemi başarısız' });
    }
});

module.exports = router;
