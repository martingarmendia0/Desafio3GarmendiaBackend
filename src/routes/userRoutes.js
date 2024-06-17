// userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../middlewares/multerConfig');
const { authorizeUser } = require('../middlewares/authorizationMiddleware');

// Ruta para registrar un nuevo usuario
router.post('/register', userController.registerUser);

// Ruta para actualizar a premium
router.patch('/premium/:uid', userController.updateUserToPremium);

// Ruta para subir documentos
router.post('/:uid/documents', upload.array('documents'), userController.uploadDocuments);

// Ruta para obtener todos los usuarios
router.get('/', authorizeUser(['admin']), userController.getAllUsers);

// Ruta para eliminar usuarios inactivos
router.delete('/', authorizeUser(['admin']), userController.deleteInactiveUsers);

module.exports = router;
