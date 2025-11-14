const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const WeeklyLetterSchema = new Schema({
    title: String,
    body: String,
    date: {
        type: Date,
        default: Date.now
    },
    images: [{
        url: String,
        filename: String
    }]
})

module.exports = mongoose.model('WeeklyLetter', WeeklyLetterSchema)