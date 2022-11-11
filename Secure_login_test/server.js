if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const { v4: uuidv4 } = require('uuid');
const Mongoose = require('mongoose');
const users = require('./Account');
const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const connectFlash = require('connect-flash')
const cookieParser = require('cookie-parser')

Mongoose
    .connect(process.env.DATABASE_LOCAL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('DataBase connected'));

const initializePassport = require('./passport-config')
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

a = 10

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.use(cookieParser('keyboard cat'))

app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', { name: req.user.name })
})

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        if (users.findOne({ email: req.body.email })) {
            console.log('email already in use!')

            res.redirect('/register')
            return
        }
        const hashedPassword = await bcrypt.hash(req.body.password, a)
        users.create({
            voornaam: req.body.voornaam,
            achternaam: req.body.achternaam,
            email: req.body.email,
            user_uuid: uuidv4(),
            password_hash: hashedPassword
        })
        res.redirect('/login')
    } catch {
        res.redirect('/register')
    }
})

app.delete('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/login');
    })
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

app.listen(3000)