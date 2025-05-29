const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true,
        default: ''
    },
    images: [{
        url: String,
        caption: String,
        position: Number
    }],
    category: {
        type: String,
        required: true,
        enum: ['Temel', 'Orta', 'İleri', 'Uzman']
    },
    instructor: {
        type: String,
        required: true
    },
    difficulty: {
        type: Number,
        min: 1,
        max: 5,
        default: 1
    },
    tags: [String],
    isPublished: {
        type: Boolean,
        default: true
    },
    viewCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Course', courseSchema); 