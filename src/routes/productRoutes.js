const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Ruta para obtener todos los productos con paginación, filtros y ordenamientos
router.get('/', productController.getProducts);

// Ruta para obtener un producto por su ID
router.get('/:pid', productController.getProductById);

module.exports = router;