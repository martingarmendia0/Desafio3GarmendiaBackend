const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

// Ruta para registrar un nuevo usuario
router.post('/register', sessionController.registerUser);

// Ruta para iniciar sesión
router.post('/login', sessionController.loginUser);

// Ruta para cerrar sesión
router.post('/logout', sessionController.logoutUser);

module.exports = router;