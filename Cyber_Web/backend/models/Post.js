const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    link: { type: String, required: true },
    comments: [{ username: String, comment: String }]
});

module.exports = mongoose.model('Post', postSchema);
