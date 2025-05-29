const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Uploads klasörü oluştur (yoksa)
const uploadsDir = path.join(__dirname, '../../frontend/uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        // Dosya adını unique yap
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

// File filter - sadece resim dosyaları kabul et
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Sadece resim dosyaları yüklenebilir! (JPEG, PNG, GIF, WebP)'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Tek resim upload endpoint'i
router.post('/image', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Resim dosyası bulunamadı' });
        }

        // Frontend'den erişilebilir URL oluştur
        const imageUrl = `/uploads/${req.file.filename}`;
        
        res.json({
            success: true,
            message: 'Resim başarıyla yüklendi',
            imageUrl: imageUrl,
            originalName: req.file.originalname,
            size: req.file.size
        });
    } catch (error) {
        console.error('Resim yükleme hatası:', error);
        res.status(500).json({ 
            success: false,
            message: 'Resim yüklenirken bir hata oluştu',
            error: error.message 
        });
    }
});

// Çoklu resim upload endpoint'i
router.post('/images', upload.array('images', 10), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'Resim dosyası bulunamadı' });
        }

        const uploadedImages = req.files.map(file => ({
            imageUrl: `/uploads/${file.filename}`,
            originalName: file.originalname,
            size: file.size
        }));
        
        res.json({
            success: true,
            message: `${req.files.length} resim başarıyla yüklendi`,
            images: uploadedImages
        });
    } catch (error) {
        console.error('Resim yükleme hatası:', error);
        res.status(500).json({ 
            success: false,
            message: 'Resimler yüklenirken bir hata oluştu',
            error: error.message 
        });
    }
});

// Resim silme endpoint'i
router.delete('/image/:filename', (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join(uploadsDir, filename);
        
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            res.json({
                success: true,
                message: 'Resim başarıyla silindi'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Resim bulunamadı'
            });
        }
    } catch (error) {
        console.error('Resim silme hatası:', error);
        res.status(500).json({ 
            success: false,
            message: 'Resim silinirken bir hata oluştu',
            error: error.message 
        });
    }
});

module.exports = router; 