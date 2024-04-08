const mongoose = require('mongoose');
require('dotenv').config(); // Importa el módulo dotenv para cargar variables de entorno

// URI de conexión a MongoDB obtenida desde las variables de entorno
const MONGODB_URI = process.env.MONGODB_URI;

// Definición del esquema de usuario
const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: { type: String, unique: true },
  age: Number,
  password: String,
  role: { type: String, default: 'usuario' }
});

// Creación del modelo de usuario
const User = mongoose.model('User', userSchema);

// Conexión a la base de datos MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conexión a MongoDB establecida'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// Exportación del modelo de usuario y la instancia de conexión a la base de datos
module.exports = { User, mongoose };