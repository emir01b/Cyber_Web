const express = require('express');
const router = express.Router();
const Topic = require('../models/Topic');
const Comment = require('../models/Comment');

// Tüm konuları getir (yorum sayısı ile birlikte)
router.get('/topics', async (req, res) => {
    try {
        console.log('GET /topics isteği alındı');
        const topics = await Topic.find().sort({ createdAt: -1 });
        
        // Her konu için yorum sayısını ekle
        const topicsWithCommentCount = await Promise.all(
            topics.map(async (topic) => {
                const commentCount = await Comment.countDocuments({ topicId: topic._id });
                return {
                    ...topic.toObject(),
                    commentCount
                };
            })
        );
        
        console.log('Bulunan konular (yorum sayısı ile):', topicsWithCommentCount);
        res.json(topicsWithCommentCount);
    } catch (err) {
        console.error('Konuları getirme hatası:', err);
        res.status(500).json({ message: err.message });
    }
});

// Belirli bir konuyu getir
router.get('/topics/:id', async (req, res) => {
    try {
        console.log('GET /topics/:id isteği alındı, ID:', req.params.id);
        const topic = await Topic.findById(req.params.id);
        if (!topic) {
            return res.status(404).json({ message: 'Konu bulunamadı' });
        }
        console.log('Bulunan konu:', topic);
        res.json(topic);
    } catch (err) {
        console.error('Konu getirme hatası:', err);
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
        // Yeni konu için yorum sayısını 0 olarak ekle
        const topicWithCommentCount = {
            ...newTopic.toObject(),
            commentCount: 0
        };
        console.log('Yeni konu oluşturuldu:', topicWithCommentCount);
        res.status(201).json(topicWithCommentCount);
    } catch (err) {
        console.error('Konu oluşturma hatası:', err);
        res.status(400).json({ message: err.message });
    }
});

// Belirli bir konunun yorumlarını getir
router.get('/topics/:id/comments', async (req, res) => {
    try {
        console.log('GET /topics/:id/comments isteği alındı, Topic ID:', req.params.id);
        const comments = await Comment.find({ topicId: req.params.id }).sort({ createdAt: 1 });
        console.log('Bulunan yorumlar:', comments);
        res.json(comments);
    } catch (err) {
        console.error('Yorumları getirme hatası:', err);
        res.status(500).json({ message: err.message });
    }
});

// Yeni yorum ekle
router.post('/topics/:id/comments', async (req, res) => {
    console.log('POST /topics/:id/comments isteği alındı:', req.body);
    
    const comment = new Comment({
        content: req.body.content,
        author: req.body.author,
        topicId: req.params.id
    });

    try {
        const newComment = await comment.save();
        console.log('Yeni yorum oluşturuldu:', newComment);
        res.status(201).json(newComment);
    } catch (err) {
        console.error('Yorum oluşturma hatası:', err);
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
