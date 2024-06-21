const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authorizeUser } = require('../controllers/sessionController');

// Ruta para crear un nuevo carrito
router.post('/', cartController.createCart);

// Ruta para obtener los productos de un carrito específico
router.get('/:cid', cartController.getCartProducts);

// Ruta para agregar un producto a un carrito específico
router.post('/:cid/products/:pid', cartController.addProductToCart);

// Ruta para eliminar un producto de un carrito específico
router.delete('/:cid/products/:pid', cartController.deleteProductFromCart);

// Ruta para actualizar la cantidad de un producto en un carrito específico
router.put('/:cid/products/:pid', cartController.updateProductQuantityInCart);

// Ruta para eliminar todos los productos de un carrito específico
router.delete('/:cid', cartController.deleteAllProductsFromCart);

// Ruta para finalizar el proceso de compra del carrito
router.post('/:cid/purchase', authorizeUser, cartController.purchaseCart);

module.exports = router;