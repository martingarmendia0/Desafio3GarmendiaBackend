// sessionRouter.js
const express = require('express');
const router = express.Router();
const passport = require('../dao/passport.config'); // Importar la configuración de Passport
const sessionController = require('../controllers/sessionController');

// Ruta para registrar un nuevo usuario
router.post('/register', sessionController.registerUser);

// Ruta para iniciar sesión
router.post('/login', passport.authenticate('local', {
    successRedirect: '/', // Redirigir al usuario a la página principal en caso de éxito
    failureRedirect: '/login', // Redirigir al usuario de vuelta al formulario de inicio de sesión en caso de error
    failureFlash: true // Habilitar mensajes flash para mostrar errores
}));

// Ruta para iniciar sesión con GitHub
router.get('/auth/github',
    passport.authenticate('github', { scope: ['user:email'] }));

router.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
        // Redirigir al usuario a la página principal después de iniciar sesión con GitHub
        res.redirect('/');
    });

module.exports = router;