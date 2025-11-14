const express = require('express');
const router = express.Router();
const WeeklyLetter = require('../models/weekly_letter');
const { requireAdmin } = require('../middleware/auth');
const { uploadWeeklyLetter } = require('../config/cloudinary');

// Index - list all letters (mounted at /weeklyletters)
router.get('/', async (req, res) => {
    try {
        const weeklyletters = await WeeklyLetter.find({}).sort({ date: -1 });
        res.render('weeklyletters/index', { weeklyletters, isAdmin: req.session.isAdmin });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error while fetching weekly letters.');
    }
});

// Show create form
router.get('/make', requireAdmin, (req, res) => {
    res.render('weeklyletters/new');
});

// Handle create
router.post('/make', requireAdmin, uploadWeeklyLetter, async (req, res) => {
    try {
        const { title, body } = req.body;
        
        // Process uploaded images
        const images = req.files ? req.files.map(file => ({
            url: file.path,
            filename: file.filename
        })) : [];
        
        const letter = new WeeklyLetter({ 
            title, 
            body, 
            date: new Date(),
            images: images
        });
        await letter.save();
        res.redirect(`/weeklyletters/${letter._id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('حدث خطأ أثناء حفظ المقال');
    }
});

// Latest letter (JSON)
router.get('/latest', async (req, res) => {
    try {
        const latestLetter = await WeeklyLetter.findOne().sort({ date: -1 });
        if (!latestLetter) return res.status(404).send('No weekly letters found.');
        res.json(latestLetter);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error while fetching latest weekly letter.');
    }
});

// Show single letter
router.get('/:id', async (req, res) => {
    try {
        const letter = await WeeklyLetter.findById(req.params.id);
        if (!letter) return res.status(404).send('المقال غير موجود');
        res.render('weeklyletters/show', { letter });
    } catch (err) {
        console.error(err);
        res.status(500).send('حدث خطأ في الخادم');
    }
});

// Edit form
router.get('/:id/edit', requireAdmin, async (req, res) => {
    try {
        const letter = await WeeklyLetter.findById(req.params.id);
        if (!letter) return res.status(404).send('المقال غير موجود');
        res.render('weeklyletters/edit', { letter });
    } catch (err) {
        console.error(err);
        res.status(500).send('حدث خطأ في الخادم');
    }
});

// Update
router.post('/:id/edit', requireAdmin, uploadWeeklyLetter, async (req, res) => {
    try {
        const { title, body } = req.body;
        const letter = await WeeklyLetter.findById(req.params.id);
        
        // Keep existing images and add new ones
        const newImages = req.files ? req.files.map(file => ({
            url: file.path,
            filename: file.filename
        })) : [];
        
        const images = [...(letter.images || []), ...newImages].slice(0, 5); // Max 5 images
        
        await WeeklyLetter.findByIdAndUpdate(req.params.id, { title, body, images });
        res.redirect('/weeklyletters');
    } catch (err) {
        console.error(err);
        res.status(500).send('حدث خطأ أثناء تحديث المقال');
    }
});

// Delete
router.post('/:id/delete', requireAdmin, async (req, res) => {
    try {
        await WeeklyLetter.findByIdAndDelete(req.params.id);
        res.redirect('/weeklyletters');
    } catch (err) {
        console.error(err);
        res.status(500).send('حدث خطأ أثناء حذف المقال');
    }
});

module.exports = router;
