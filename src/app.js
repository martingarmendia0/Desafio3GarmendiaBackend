//app.js
const express = require('express');
const exphbs = require('express-handlebars').create();
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const fs = require('fs');
const Swal = require ('sweetalert2');
const mongoose = require('../dao/db');
const Message = require('../dao/models/MessageModel');
const Cart = require('../dao/models/CartModel');
const Product = require('../dao/models/ProductModels');
const messageRoutes = require('./routes/messageRoutes');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const ProductManager = require('../dao/models/ProductManager');
const productManager = new ProductManager(path.join(__dirname, 'data', 'products.json'));

// Configuración de Handlebars
app.engine('handlebars', exphbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.get('/realTimeProducts', async (req, res) => {
  try {
    // Lee los productos desde el ProductManager
    const products = await productManager.getAllProducts();

    // Renderiza la vista y pasa los productos como contexto
    res.render('realTimeProducts', { products });
  } catch (error) {
    console.error('Error obteniendo productos:', error.message);
    res.status(500).send('Error obteniendo productos');
  }
});

// Middleware para servir archivos estáticos (styles, scripts, etc.)
app.use(express.static(path.join(__dirname, 'public')));
app.use('/scripts', express.static(path.join(__dirname, 'public', 'scripts')));

// Middleware para procesar JSON en las solicitudes
app.use(express.json());

// Configuración del puerto
const PORT = 8080;

// Inicio del servidor
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Ruta para renderizar la vista de chat
app.get('/chat', (req, res) => {
  res.render('chat'); // Renderiza la vista de chat
});

// Manejo de conexiones con Socket.io
io.on('connection', async (socket) => {
  console.log('Usuario conectado');

  // Manejar mensajes de chat entrantes
  socket.on('chatMessage', async (message) => {
    try {
      // Guardar el mensaje en la base de datos
      const newMessage = new Message({ user: message.user, message: message.message });
      await newMessage.save();

      // Emitir el mensaje a todos los clientes conectados
      io.emit('chatMessage', newMessage);
    } catch (error) {
      console.error('Error al guardar el mensaje:', error.message);
    }
  });

  // Obtener la lista inicial de productos y emitirla al cliente
  try {
    const initialProducts = await productManager.getAllProducts();
    socket.emit('initialProducts', initialProducts);
  } catch (error) {
    console.error('Error obteniendo productos iniciales:', error.message);
  }

  // Manejar la desconexión del usuario
  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });

  // Manejar la solicitud para agregar un nuevo producto
  socket.on('addProduct', async (newProduct) => {
    try {
      // Agregar el nuevo producto utilizando el ProductManager
      const addedProduct = await productManager.addProduct(newProduct);

      // Emitir la lista actualizada de productos al cliente
      io.emit('productUpdated', { products: await productManager.getAllProducts() });
    } catch (error) {
      // Manejar el error, por ejemplo, emitir un mensaje de error al cliente
      console.error('Error adding product:', error.message);
      socket.emit('addError', error.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});