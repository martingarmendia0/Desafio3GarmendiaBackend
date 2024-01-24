const express = require('express');
const exphbs = require('express-handlebars').create();
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Configuración de Handlebars
app.engine('handlebars', exphbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Ruta para /realTimeProducts
app.get('/realTimeProducts', (req, res) => {
  // Lee los productos desde el archivo JSON
  const productsData = fs.readFileSync(path.join(__dirname, 'data/products.json'));
  const products = JSON.parse(productsData);

  // Renderiza la vista y pasa los productos como contexto
  res.render('realTimeProducts', { products });
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

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

// Configuración de Socket.io en la aplicación
app.set('io', io);