// ProductModel.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  availability: { type: Boolean, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;