// services/UserService.js

const UserRepository = require('../repositories/UserRepository');

class UserService {
  constructor() {
    this.userRepository = UserRepository.getUserDAO(); // Obtén el repositorio deseado
  }

  async createUser(userData) {
    return await this.userRepository.createUser(userData);
  }
}

module.exports = UserService;
