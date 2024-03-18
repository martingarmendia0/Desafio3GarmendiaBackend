// sessionRouter.js
const express = require('express');
const router = express.Router();
const passport = require('../config/passport.config');
const sessionController = require('../controllers/sessionController');

router.post('/register', sessionController.registerUser);

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/auth/github',
    passport.authenticate('github', { scope: ['user:email'] }));

router.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('/');
    });
    
router.post('/login/jwt', sessionController.loginUserWithJWT);

router.get('/current', passport.authenticate('current', { session: false }), (req, res) => {
    res.status(200).json({ user: req.user });
});

module.exports = router;