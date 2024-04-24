const express = require('express');
const router = express.Router();
const passport = require('../config/passport.config');
const sessionController = require('../controllers/sessionController');
const UserDTO = require('../dtos/UserDTO');

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

router.get('/current', passport.authenticate('current', { session: false }), (req, res) => {
    const userDTO = new UserDTO(req.user); // Crea un DTO del usuario
    res.status(200).json({ user: userDTO }); // Envia el DTO en la respuesta
});

module.exports = router;