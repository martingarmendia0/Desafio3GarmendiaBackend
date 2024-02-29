const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

// Ruta para iniciar sesión
router.post('/login', sessionController.loginUser);

module.exports = router;