// CartRepository.js

const CartModel = require('../models/CartModel');

class CartRepository {
  async create(data) {
    return await CartModel.create(data);
  }

  async findById(id) {
    return await CartModel.findById(id);
  }

  async update(id, data) {
    return await CartModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await CartModel.findByIdAndDelete(id);
  }
}

module.exports = new CartRepository();