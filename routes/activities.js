const express = require('express');
const router = express.Router();
const ActivityCourse = require('../models/activity_course');
const { requireAdmin } = require('../middleware/auth');
const { uploadActivity } = require('../config/cloudinary');
const { cloudinary } = require('../config/cloudinary');

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
router.post('/new', requireAdmin, uploadActivity, async (req, res) => {
    try {
        const { title, summary, date, registrationLink, isActive, imageLinks } = req.body;

        // Process uploaded images
        const images = req.files ? req.files.map(file => ({
            url: file.path,
            filename: file.filename
        })) : [];

        // Process external image links
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
            images: images,
            imageLinks: imageLinkArray
        });

        await activity.save();
        res.redirect(`/activities/${activity._id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('خطأ أثناء حفظ النشاط');
    }
});// Show single activity/course
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
router.post('/:id/edit', requireAdmin, uploadActivity, async (req, res) => {
    try {
        const { title, summary, date, registrationLink, isActive, imageLinks } = req.body;
        const activity = await ActivityCourse.findById(req.params.id);

        // Keep existing images and add new ones
        const newImages = req.files ? req.files.map(file => ({
            url: file.path,
            filename: file.filename
        })) : [];

        const images = [...(activity.images || []), ...newImages].slice(0, 5); // Max 5 images

        // Process external image links
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
            images: images,
            imageLinks: imageLinkArray
        });

        res.redirect(`/activities/${req.params.id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('خطأ أثناء تحديث النشاط');
    }
});// Handle delete (admin only)
router.post('/:id/delete', requireAdmin, async (req, res) => {
    try {
        const activity = await ActivityCourse.findById(req.params.id);
        if (!activity) return res.status(404).send('النشاط غير موجود');

        // Delete uploaded images from Cloudinary
        if (activity.images && activity.images.length > 0) {
            const destroys = activity.images.map(img =>
                cloudinary.uploader.destroy(img.filename, { resource_type: 'image' }).catch(err => {
                    console.error('Cloudinary delete error for', img.filename, err);
                })
            );
            await Promise.all(destroys);
        }

        await ActivityCourse.findByIdAndDelete(req.params.id);
        res.redirect('/activities');
    } catch (err) {
        console.error(err);
        res.status(500).send('خطأ أثناء حذف النشاط');
    }
});

// Delete a single uploaded image
router.delete('/:id/images/:filename', requireAdmin, async (req, res) => {
    try {
        const filename = decodeURIComponent(req.params.filename);
        const activity = await ActivityCourse.findById(req.params.id);
        if (!activity) return res.status(404).json({ error: 'النشاط غير موجود' });

        const img = activity.images.find(i => i.filename === filename);
        if (!img) return res.status(404).json({ error: 'الصورة غير موجودة' });

        activity.images = activity.images.filter(i => i.filename !== filename);
        await activity.save();

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(filename, { resource_type: 'image' });

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'خطأ أثناء حذف الصورة' });
    }
});

module.exports = router;
