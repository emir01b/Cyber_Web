const express = require('express');
const router = express.Router();
const Topic = require('../models/Topic');

// Tüm konuları getir
router.get('/topics', async (req, res) => {
    try {
        console.log('GET /topics isteği alındı');
        const topics = await Topic.find().sort({ createdAt: -1 });
        console.log('Bulunan konular:', topics);
        res.json(topics);
    } catch (err) {
        console.error('Konuları getirme hatası:', err);
        res.status(500).json({ message: err.message });
    }
});

// Yeni konu oluştur
router.post('/topics', async (req, res) => {
    console.log('POST /topics isteği alındı:', req.body);
    
    const topic = new Topic({
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
    });

    try {
        const newTopic = await topic.save();
        console.log('Yeni konu oluşturuldu:', newTopic);
        res.status(201).json(newTopic);
    } catch (err) {
        console.error('Konu oluşturma hatası:', err);
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
