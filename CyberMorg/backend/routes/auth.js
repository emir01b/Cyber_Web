const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendVerificationEmail } = require('../services/emailService');
require('dotenv').config();

// Doğrulama kodlarını geçici olarak saklamak için
const verificationCodes = new Map();

// Kullanıcı sayısını döndüren endpoint
router.get('/count', async (req, res) => {
    try {
        const count = await User.countDocuments();
        res.json({ count });
    } catch (error) {
        console.error('Kullanıcı sayısı hatası:', error);
        res.status(500).json({ 
            error: 'Kullanıcı sayısı alınamadı',
            details: error.message
        });
    }
});

// Kayıt için doğrulama kodu gönderme
router.post('/send-verification', async (req, res) => {
    try {
        const { email, username } = req.body;
        
        // E-posta ve kullanıcı adının benzersiz olduğunu kontrol et
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });

        if (existingUser) {
            return res.status(400).json({ 
                error: 'Bu e-posta veya kullanıcı adı zaten kullanımda' 
            });
        }
        
        // Rastgele bir doğrulama kodu oluştur
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Kodu geçici olarak sakla
        verificationCodes.set(email, {
            code: verificationCode,
            timestamp: Date.now(),
            username: username
        });

        // E-posta gönder
        const emailResult = await sendVerificationEmail(email, verificationCode, username);
        
        if (emailResult.success) {
            console.log(`Doğrulama kodu e-posta ile gönderildi: ${email} için`);
            
            // Başarılı yanıt (güvenlik için kodu döndürme)
            res.json({ 
                message: 'Doğrulama kodu e-posta adresinize gönderildi. Gelen kutunuzu kontrol edin. Gelen kutunuz boş ise spam klasörüne bakmayı unutmayın.'
            });
        } else {
            console.error('E-posta gönderme hatası:', emailResult.error);
            res.status(500).json({ 
                error: 'Doğrulama e-postası gönderilemedi. Lütfen e-posta adresinizi kontrol edin.',
                details: emailResult.error
            });
        }
    } catch (error) {
        console.error('Doğrulama kodu hatası:', error);
        res.status(500).json({ 
            error: 'Doğrulama kodu gönderilemedi',
            details: error.message
        });
    }
});

// Kullanıcı kaydı
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, verificationCode } = req.body;

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

        console.log(`Yeni kullanıcı kaydedildi: ${username}, ${email}`);

        // Başarılı yanıt
        res.status(200).json({ 
            message: 'Kullanıcı başarıyla kaydedildi',
            user: {
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Kayıt hatası:', error);
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
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        console.log(`Kullanıcı giriş yaptı: ${user.username}, ${user.email}, Admin: ${user.isAdmin}`);

        // Başarılı yanıt
        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin
            }
        });
    } catch (error) {
        console.error('Giriş hatası:', error);
        res.status(500).json({ 
            error: 'Giriş işlemi başarısız',
            details: error.message
        });
    }
});

module.exports = router;
