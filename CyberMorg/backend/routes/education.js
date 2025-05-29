const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Admin kontrolü middleware
const isAdmin = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Token bulunamadı' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        
        if (!user || !user.isAdmin) {
            return res.status(403).json({ message: 'Admin yetkisi gerekli' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Geçersiz token' });
    }
};

// Tüm kursları getir
router.get('/courses', async (req, res) => {
    try {
        console.log('GET /courses isteği alındı');
        const courses = await Course.find({ isPublished: true }).sort({ createdAt: -1 });
        console.log('Bulunan kurslar:', courses);
        res.json(courses);
    } catch (error) {
        console.error('Kurs verisi getirme hatası:', error);
        res.status(500).json({ 
            message: 'Kurs verileri alınamadı',
            error: error.message 
        });
    }
});

// Belirli bir kursu getir
router.get('/courses/:id', async (req, res) => {
    try {
        console.log('GET /courses/:id isteği alındı, ID:', req.params.id);
        
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Eğitim bulunamadı' });
        }

        // Görüntüleme sayısını artır
        course.viewCount += 1;
        await course.save();
        
        console.log('Kurs bulundu:', course);
        res.json(course);
    } catch (error) {
        console.error('Kurs getirme hatası:', error);
        res.status(500).json({ 
            message: 'Kurs verisi alınamadı',
            error: error.message 
        });
    }
});

// Yeni kurs ekle (sadece admin)
router.post('/courses', isAdmin, async (req, res) => {
    try {
        console.log('POST /courses isteği alındı:', req.body);
        
        const { title, description, content, category, instructor, difficulty, tags, images } = req.body;
        
        const course = new Course({
            title,
            description,
            content,
            category,
            instructor,
            difficulty: difficulty || 1,
            tags: tags || [],
            images: images || []
        });

        const newCourse = await course.save();
        console.log('Yeni kurs oluşturuldu:', newCourse);
        res.status(201).json(newCourse);
    } catch (error) {
        console.error('Kurs oluşturma hatası:', error);
        res.status(400).json({ 
            message: 'Kurs oluşturulamadı',
            error: error.message 
        });
    }
});

// Kurs güncelle (sadece admin)
router.put('/courses/:id', isAdmin, async (req, res) => {
    try {
        console.log('PUT /courses/:id isteği alındı, ID:', req.params.id);
        
        const { title, description, content, category, instructor, difficulty, tags, images, isPublished } = req.body;
        
        const updatedCourse = await Course.findByIdAndUpdate(
            req.params.id,
            {
                title,
                description,
                content,
                category,
                instructor,
                difficulty,
                tags,
                images,
                isPublished,
                updatedAt: Date.now()
            },
            { new: true }
        );

        if (!updatedCourse) {
            return res.status(404).json({ message: 'Kurs bulunamadı' });
        }
        
        console.log('Kurs güncellendi:', updatedCourse);
        res.json(updatedCourse);
    } catch (error) {
        console.error('Kurs güncelleme hatası:', error);
        res.status(500).json({ 
            message: 'Kurs güncellenemedi',
            error: error.message 
        });
    }
});

// Kurs sil (sadece admin)
router.delete('/courses/:id', isAdmin, async (req, res) => {
    try {
        console.log('DELETE /courses/:id isteği alındı, ID:', req.params.id);
        
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Kurs bulunamadı' });
        }
        
        console.log('Kurs silindi:', course);
        res.json({ message: 'Kurs başarıyla silindi' });
    } catch (error) {
        console.error('Kurs silme hatası:', error);
        res.status(500).json({ 
            message: 'Kurs silinemedi',
            error: error.message 
        });
    }
});

module.exports = router;
