const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const User = require('../models/model');
const ejs = require('ejs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const routes = express.Router();




mongoose.connect("mongodb+srv://new_user31:shashi1967@cluster0.wdiuq.mongodb.net/mydb?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database connected'))
    .catch((err) => console.log(err));

routes.use(bodyParser.urlencoded({ extended: true }));

routes.use(cookieParser('secret'));

routes.use(session({
    secret: 'secret',
    maxAge: 3600000,
    resave: true,
    saveUninitialized: true
}));

routes.use(passport.initialize());
routes.use(passport.session());
routes.use(flash());



routes.use((req, res, next) => {
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    res.locals.error = req.flash('error');
    next();
})


routes.get('/', (req, res) => {
    res.render('home');
});

routes.get('/login', (req, res) => {
    res.render('login')
});

routes.get('/register', (req, res) => {
    res.render('register');
});

routes.get('/dashboard', (req, res) => {
    res.render('dashboard');
});


routes.post('/register', (req, res) => {
    const { name, username, email, password, cnfmpassword } = req.body;
    let err
    if (!name || !username || !email || !password || !cnfmpassword) {
        err = 'Please fill in all fields';
        res.render('register', { 'err': err });
        return;
    }

    else if (password.length < 6 || cnfmpassword.length < 6) {
        err = 'Password length should be atleast 6 characters long';
        res.render('register', { 'err': err, 'name': name, 'username': username, 'email': email });
        return;
    }

    else if (password != cnfmpassword) {
        err = "Passwords do not match";
        res.render('register', { 'err': err, 'name': name, 'username': username, 'email': email });
    }

    else {
        if (typeof err == 'undefined') {
            User.findOne({ email: email }, (err, data) => {
                if (err) throw err;
                if (data) {
                    console.log('User exists');
                    err = 'User already registered'
                    res.render('register', { 'err': err })
                }

                else {
                    const user = new User({ name, email, password });

                    user.save((err, user) => {
                        if (err) throw err;
                        res.redirect('/login');
                    })
                }
            })
        }
    }

});


passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email: email }, (err, data) => {
        if (err) throw err;

        if (!data) {
            return done(null, false, { 'message': "User doesn't exists" })
        }

        else if (password != data.password) {
            return done(null, false, { 'message': 'Incorrect password' });
        }

        else {
            return done(null, data);
        }


    })
}))

passport.serializeUser((user, cb) => {
    cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
    User.findById(id, (err, user) => {
        cb(err, user);
    })
})




routes.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        failureRedirect: '/login',
        successRedirect: '/dashboard',
        failureFlash: true
    })(req, res, next);
});




routes.get('/logout', (req,res) => {
    req.logout();
    res.redirect('/login');
})







module.exports = routes;