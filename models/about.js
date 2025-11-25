const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AboutSchema = new Schema({
    profileImage: {
        url: { type: String, default: '' },
        filename: { type: String, default: '' }
    },
    intro: { type: String, default: '' }, // main about text
    snippet: { type: String, default: '' }, // نبذة عن الصفحة (shown on home)
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('About', AboutSchema);
