const express = require('express');
const router = express.Router();
const About = require('../models/about');
const { requireAdmin } = require('../middleware/auth');
const { uploadGeneral } = require('../config/cloudinary');

// Show About page (public)
router.get('/', async (req, res) => {
    try {
        let about = await About.findOne({});
        if (!about) {
            // create a default doc so admin can edit it later
            about = new About({
                intro: '',
                snippet: ''
            });
            await about.save();
        }
        res.render('about', { isAdmin: req.session.isAdmin, about });
    } catch (err) {
        console.error(err);
        res.status(500).send('خطأ في الخادم أثناء جلب صفحة من أنا');
    }
});

// Edit form (admin only)
router.get('/edit', requireAdmin, async (req, res) => {
    try {
        let about = await About.findOne({});
        if (!about) about = new About();
        res.render('about_edit', { about });
    } catch (err) {
        console.error(err);
        res.status(500).send('خطأ في الخادم');
    }
});

// Handle edit (admin only)
router.post('/edit', requireAdmin, uploadGeneral, async (req, res) => {
    try {
        const { intro, snippet } = req.body;

        let about = await About.findOne({});
        if (!about) about = new About();

        // Update simple fields
        about.intro = intro || '';
        about.snippet = snippet || '';

        // If a new profile image was uploaded, set it
        if (req.file) {
            about.profileImage = {
                url: req.file.path,
                filename: req.file.filename
            };
        }

        about.updatedAt = new Date();
        await about.save();

        res.redirect('/about');
    } catch (err) {
        console.error(err);
        res.status(500).send('خطأ أثناء حفظ صفحة من أنا');
    }
});

module.exports = router;
