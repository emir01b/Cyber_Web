const mongoose = require('mongoose');

const CyberHaberSchema = new mongoose.Schema({
    title: { type: String, required: true },
    link: { type: String, required: true, unique: true },
    description: { type: String },
    image: { type: String },
    publishedAt: { type: String }
});

module.exports = mongoose.model('CyberHaber', CyberHaberSchema);