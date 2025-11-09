const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const WeeklyLetterSchema = new Schema({
    title: String,
    body: String,
    date: {           // lowercase "date" is better naming convention
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('WeeklyLetter', WeeklyLetterSchema)