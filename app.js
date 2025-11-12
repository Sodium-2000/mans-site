const express = require('express');
const { default: mongoose } = require('mongoose');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true })); // for parsing form data
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // set to true if using https
}));
const DB_URL = process.env.DB_URL;
// Note: admin authentication middleware lives in middleware/auth.js
mongoose.connect(DB_URL, {
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log('Database connected');
})

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
const weeklyLettersRouter = require('./routes/weeklyletters');
app.use('/weeklyletters', weeklyLettersRouter);

const activitiesRouter = require('./routes/activities');
app.use('/activities', activitiesRouter);

// Admin Routes
app.get('/admin/login', (req, res) => {
    res.render('admin/login', { error: null });
});

app.post('/admin/login', (req, res) => {
    const { password } = req.body;
    if (password === process.env.ADMIN_PASSWORD) {
        req.session.isAdmin = true;
        res.redirect('/weeklyletters');
    } else {
        res.render('admin/login', { error: 'كلمة المرور غير صحيحة' });
    }
});

app.get('/admin/logout', (req, res) => {
    req.session.isAdmin = false;
    res.redirect('/weeklyletters');
});

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/about', (req, res) => {
    res.render('about', { isAdmin: req.session.isAdmin });
})

// Weeklyletters routes moved to ./routes/weeklyletters.js


app.listen(3000, () => {
    console.log('Serving on port 3000')
})