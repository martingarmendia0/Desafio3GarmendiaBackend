const mongoose = require('mongoose');

// Definición del esquema de usuario
const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: { type: String, unique: true },
  age: Number,
  password: String,
  role: { type: String, default: 'usuario' } // Por defecto, los usuarios tendrán el rol 'usuario'
});

// Creación del modelo de usuario
const User = mongoose.model('User', userSchema);

// Conexión a la base de datos MongoDB
const MONGODB_URI = 'mongodb+srv://martingarmendia0:i0hq5nh3zcfUhijg@cursocoder.uzqe7xp.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conexión a MongoDB establecida'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// Exportación del modelo de usuario y la instancia de conexión a la base de datos
module.exports = { User, mongoose };