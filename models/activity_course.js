const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivityCourseSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        default: ''
    },
    date: {
        type: Date,
        default: Date.now
    },
    registrationLink: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    },
    images: [{
        url: String,
        filename: String
    }],
    imageLinks: [{
        type: String
    }]
});

module.exports = mongoose.model('ActivityCourse', ActivityCourseSchema);
