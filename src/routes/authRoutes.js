// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const userService = require('../services/UserService');

router.post('/forgot-password', userService.forgotPassword);

module.exports = router;