const express = require('express');
const router = express.Router();
const News = require('../models/News');
const { scrapeNews, testScraper } = require('../scrapers/newsScraper');

// Haberleri getir
router.get('/', async (req, res) => {
    try {
        console.log('Haberler istendi');
        
        // Her istekte yeni haberler çek
        console.log('Yeni haberler çekiliyor...');
        await scrapeNews();
        
        // Haberleri getir
        const news = await News.find().sort({ date: -1 }).lean();
        console.log(`${news.length} haber bulundu ve gönderiliyor`);
        
        if (!news || news.length === 0) {
            return res.status(404).json({ 
                success: false, 
                error: 'Haber bulunamadı' 
            });
        }

        res.json({ 
            success: true, 
            data: news 
        });
    } catch (error) {
        console.error('Haber getirme hatası:', error);
        
        // Hata durumunda veritabanındaki mevcut haberleri gönder
        try {
            const existingNews = await News.find().sort({ date: -1 }).lean();
            if (existingNews && existingNews.length > 0) {
                return res.json({
                    success: true,
                    data: existingNews,
                    note: 'Yeni haberler çekilemedi, mevcut haberler gösteriliyor'
                });
            }
        } catch (dbError) {
            console.error('Veritabanı hatası:', dbError);
        }

        res.status(500).json({ 
            success: false, 
            error: 'Haberler alınamadı',
            details: error.message 
        });
    }
});

// Test endpoint'i
router.get('/test', async (req, res) => {
    try {
        console.log('Scraper test ediliyor...');
        const news = await testScraper();
        res.json({ 
            success: true, 
            count: news.length, 
            news 
        });
    } catch (error) {
        console.error('Test hatası:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

module.exports = router;
