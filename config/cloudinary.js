const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Storage for activity/course images
const activityStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'activities',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: [
            { width: 1600, height: 1600, crop: 'limit' },
            { quality: 'auto:eco' },
            { fetch_format: 'auto' }
        ]
    }
});

// Storage for weekly letter images
const weeklyLetterStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'weekly-letters',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: [
            { width: 1600, height: 1600, crop: 'limit' },
            { quality: 'auto:eco' },
            { fetch_format: 'auto' }
        ]
    }
});

// Storage for profile/general images
const generalStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'general',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp']
        ,
        transformation: [
            { width: 1600, height: 1600, crop: 'limit' },
            { quality: 'auto:eco' },
            { fetch_format: 'auto' }
        ]
    }
});

// Multer instances (allow larger uploads; Cloudinary will compress stored images)
const uploadActivity = multer({
    storage: activityStorage,
    limits: { fileSize: 25 * 1024 * 1024 } // 25MB per file
}).array('images', 5);

const uploadWeeklyLetter = multer({
    storage: weeklyLetterStorage,
    limits: { fileSize: 25 * 1024 * 1024 }
}).array('images', 5);

const uploadGeneral = multer({
    storage: generalStorage,
    limits: { fileSize: 25 * 1024 * 1024 }
}).single('image');

module.exports = {
    cloudinary,
    uploadActivity,
    uploadWeeklyLetter,
    uploadGeneral
};
