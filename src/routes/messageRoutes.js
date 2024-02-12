// messageRoutes.js

const express = require('express');
const router = express.Router();
const Message = require('/Users/tinchi/Desktop/curso coder/backend/Desafio5Garmendia-master/dao/models/MessageModel');

// Ruta para guardar un nuevo mensaje en la base de datos
router.post('/messages', async (req, res) => {
  try {
    const { user, message } = req.body;

    // Crea un nuevo mensaje utilizando el modelo de mensaje
    const newMessage = new Message({ user, message });

    // Guarda el nuevo mensaje en la base de datos
    await newMessage.save();

    res.status(201).json({ message: 'Mensaje guardado correctamente' });
  } catch (error) {
    console.error('Error al guardar el mensaje:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;