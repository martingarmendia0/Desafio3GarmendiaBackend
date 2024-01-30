//app.js
const express = require('express');
const exphbs = require('express-handlebars').create();
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const fs = require('fs');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const ProductManager = require('./models/ProductManager');
const productManager = new ProductManager(path.join(__dirname, 'data', 'products.json'));

// Configuración de Handlebars
app.engine('handlebars', exphbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Ruta para /realTimeProducts
app.get('/realTimeProducts', (req, res) => {
  // Lee los productos desde el archivo JSON
  const productsData = fs.readFileSync(path.join(__dirname, 'data', 'products.json'));
  const products = JSON.parse(productsData);

  // Renderiza la vista y pasa los productos como contexto
  res.render('layouts/realTimeProducts', { products });
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

// Manejo de conexiones con Socket.io
io.on('connection', (socket) => {
  console.log('Usuario conectado');

  // Obtener la lista inicial de productos y emitirla al cliente
  try {
    const initialProducts = productManager.getProducts();
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
      io.emit('productUpdated', { products: productManager.getProducts() });
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

// Middleware de manejo de errores para rutas no encontradas
app.use((req, res, next) => {
  res.status(404).send("La ruta solicitada no fue encontrada.");
});

// Middleware de manejo de errores para errores internos del servidor
app.use((err, req, res, next) => {
  console.error('Error interno del servidor:', err);
  res.status(500).send('Error interno del servidor');
});
// Configuración de Socket.io en la aplicación
app.set('io', io);