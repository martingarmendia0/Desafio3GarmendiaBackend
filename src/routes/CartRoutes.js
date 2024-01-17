const express = require('express');
const router = express.Router();
const cartController = require('../controllers/CartController');

router.post('/', cartController.createCart);
router.get('/:cid', cartController.getCartProducts);
router.post('/:cid/product/:pid', cartController.addProductToCart);

module.exports = router;