const express = require('express');
const router = express.Router();
const CyberHaber = require('../models/CyberHaber');

// Tüm haberleri alma
router.get('/', async (req, res) => {
    try {
        const posts = await CyberHaber.find();
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
