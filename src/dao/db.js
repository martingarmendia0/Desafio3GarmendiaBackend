const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://martingarmendia0:i0hq5nh3zcfUhijg@cursocoder.uzqe7xp.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conexión a MongoDB establecida'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

module.exports = mongoose;

module.exports= MONGODB_URI;