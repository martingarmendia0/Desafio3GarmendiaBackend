const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../middlewares/multerConfig');

// Ruta para registrar un nuevo usuario
router.post('/register', userController.registerUser);

// Ruta para actualizar a premium
router.patch('/premium/:uid', userController.updateUserToPremium);

// Ruta para subir documentos
router.post('/:uid/documents', upload.array('documents'), userController.uploadDocuments);

module.exports = router;