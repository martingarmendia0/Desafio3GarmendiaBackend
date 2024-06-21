const express = require('express');
const exphbs = require('express-handlebars').create({ defaultLayout: 'main' });
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const mongoose = require('./dao/db');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const { developmentLogger, productionLogger } = require('./config/loggerConfig');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUiExpress = require('swagger-ui-express');
const messageRoutes = require('./routes/messageRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes'); // Asegúrate de que cartRoutes esté en la ubicación correcta
const ProductManager = require('./dao/models/ProductManager');
const productManager = new ProductManager(path.join(__dirname, 'data', 'products.json'));

// Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentación',
            description: 'API para clase de Swagger'
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
};

const specs = swaggerJsDoc(swaggerOptions);
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

// Configuración de Handlebars
app.engine('handlebars', exphbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware para servir archivos estáticos (styles, scripts, etc.)
app.use(express.static(path.join(__dirname, 'public')));
app.use('/scripts', express.static(path.join(__dirname, 'public', 'scripts')));

// Middleware para procesar JSON en las solicitudes
app.use(express.json());

// Configuración de sesiones
app.use(session({
    secret: 'secreto',
    resave: false,
    saveUninitialized: false
}));

// Inicialización de Passport
app.use(passport.initialize());
app.use(passport.session());

// Configuración de Passport para autenticación local
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, (email, password, done) => {
    // Aquí va la lógica para autenticar al usuario utilizando Mongoose o cualquier otra forma
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    // Aquí va la lógica para encontrar al usuario por su ID
});

// Logger de desarrollo
developmentLogger.debug('Este es un mensaje de debug');

// Middleware para verificar si el usuario está autenticado
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

// Rutas
app.use('/messages', messageRoutes);
app.use('/products', productRoutes);
app.use('/carts', cartRoutes); // Usa el objeto cartRoutes correctamente

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/index', (req, res) => {
    res.render('index', { title: 'Página Principal' });
});

app.get('/realTimeProducts', (req, res) => {
    res.render('realTimeProducts', { title: 'Productos en tiempo real' });
});

app.get('/chat', isAuthenticated, (req, res) => {
    res.render('chat', { title: 'Chat' });
});

app.get('/cart', isAuthenticated, (req, res) => {
    res.render('cart', { title: 'Carrito' });
});

app.get('/productDetails', (req, res) => {
    res.render('productDetails', { title: 'Detalles del producto' });
});

app.get('/reset-password', (req, res) => {
    res.render('reset-password', { title: 'Restablecer contraseña' });
});

// Inicio del servidor
const PORT = process.env.PORT || 8080; // Añadido soporte para puerto dinámico
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Socket.io
io.on('connection', async (socket) => {
    console.log('Usuario conectado');

    // Ejemplos de eventos de Socket.io
    socket.on('chatMessage', async (message) => {
        // Lógica para manejar mensajes de chat
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });

    try {
        const initialProducts = await productManager.getAllProducts();
        socket.emit('initialProducts', initialProducts);
    } catch (error) {
        console.error('Error obteniendo productos iniciales:', error.message);
    }

    socket.on('addProduct', async (newProduct) => {
        try {
            const addedProduct = await productManager.addProduct(newProduct);
            io.emit('productUpdated', { products: await productManager.getAllProducts() });
        } catch (error) {
            console.error('Error adding product:', error.message);
            socket.emit('addError', error.message);
        }
    });
});

// Endpoint /loggerTest
app.get('/loggerTest', (req, res) => {
    try {
        developmentLogger.info('Se ha accedido al endpoint /loggerTest');
        res.status(200).json({ message: 'Logger test successful' });
    } catch (error) {
        productionLogger.error('Error en el endpoint /loggerTest:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = app;