// Simple admin auth middleware
module.exports.requireAdmin = (req, res, next) => {
    if (req.session && req.session.isAdmin) {
        return next();
    }
    return res.redirect('/admin/login');
};
