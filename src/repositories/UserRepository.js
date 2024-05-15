// repositories/UserRepository.js

const User = require('../dao/models/UserModel');

class UserRepository {
  async findById(id) {
    return await User.findById(id);
  }

  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async createUser(userData) {
    return await User.create(userData);
  }

  // Agrega otras operaciones de consulta y actualización según sea necesario
}

module.exports = UserRepository;