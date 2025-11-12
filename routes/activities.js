const express = require('express');
const router = express.Router();
const ActivityCourse = require('../models/activity_course');
const { requireAdmin } = require('../middleware/auth');

// Index - list all activities/courses
router.get('/', async (req, res) => {
    try {
        // Sort by isActive (true first), then by date (newest first)
        const activities = await ActivityCourse.find({})
            .sort({ isActive: -1, date: -1 });
        res.render('activities/index', { activities, isAdmin: req.session.isAdmin });
    } catch (err) {
        console.error(err);
        res.status(500).send('خطأ في الخادم أثناء جلب الأنشطة');
    }
});

// Show create form (admin only)
router.get('/new', requireAdmin, (req, res) => {
    res.render('activities/new');
});

// Handle create (admin only)
router.post('/new', requireAdmin, async (req, res) => {
    try {
        const { title, summary, date, registrationLink, isActive, imageLinks } = req.body;
        
        // Process image links (could be comma-separated or array)
        let imageLinkArray = [];
        if (imageLinks) {
            imageLinkArray = typeof imageLinks === 'string' 
                ? imageLinks.split(',').map(link => link.trim()).filter(link => link)
                : imageLinks;
        }

        const activity = new ActivityCourse({
            title,
            summary: summary || '',
            date: date || new Date(),
            registrationLink: registrationLink || '',
            isActive: isActive === 'true' || isActive === true,
            imageLinks: imageLinkArray
        });
        
        await activity.save();
        res.redirect(`/activities/${activity._id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('خطأ أثناء حفظ النشاط');
    }
});

// Show single activity/course
router.get('/:id', async (req, res) => {
    try {
        const activity = await ActivityCourse.findById(req.params.id);
        if (!activity) return res.status(404).send('النشاط غير موجود');
        res.render('activities/show', { activity, isAdmin: req.session.isAdmin });
    } catch (err) {
        console.error(err);
        res.status(500).send('خطأ في الخادم');
    }
});

// Edit form (admin only)
router.get('/:id/edit', requireAdmin, async (req, res) => {
    try {
        const activity = await ActivityCourse.findById(req.params.id);
        if (!activity) return res.status(404).send('النشاط غير موجود');
        res.render('activities/edit', { activity });
    } catch (err) {
        console.error(err);
        res.status(500).send('خطأ في الخادم');
    }
});

// Handle update (admin only)
router.post('/:id/edit', requireAdmin, async (req, res) => {
    try {
        const { title, summary, date, registrationLink, isActive, imageLinks } = req.body;
        
        // Process image links
        let imageLinkArray = [];
        if (imageLinks) {
            imageLinkArray = typeof imageLinks === 'string' 
                ? imageLinks.split(',').map(link => link.trim()).filter(link => link)
                : imageLinks;
        }

        await ActivityCourse.findByIdAndUpdate(req.params.id, {
            title,
            summary: summary || '',
            date: date || new Date(),
            registrationLink: registrationLink || '',
            isActive: isActive === 'true' || isActive === true,
            imageLinks: imageLinkArray
        });
        
        res.redirect(`/activities/${req.params.id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('خطأ أثناء تحديث النشاط');
    }
});

// Handle delete (admin only)
router.post('/:id/delete', requireAdmin, async (req, res) => {
    try {
        await ActivityCourse.findByIdAndDelete(req.params.id);
        res.redirect('/activities');
    } catch (err) {
        console.error(err);
        res.status(500).send('خطأ أثناء حذف النشاط');
    }
});

module.exports = router;
