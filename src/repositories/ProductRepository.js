// ProductRepository.js

const ProductModel = require('../models/ProductModel');

class ProductRepository {
  async create(data) {
    return await ProductModel.create(data);
  }

  async findById(id) {
    return await ProductModel.findById(id);
  }

  async update(id, data) {
    return await ProductModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await ProductModel.findByIdAndDelete(id);
  }
}

module.exports = new ProductRepository();