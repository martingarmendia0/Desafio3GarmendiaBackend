const CartManager = require('../models/CartManager');
const cartManager = new CartManager('./data/carts.json');

exports.createCart = async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.json(newCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCartProducts = async (req, res) => {
    try {
        const { cid } = req.params;
        const cartProducts = await cartManager.getCartProducts(cid);
        res.json(cartProducts);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.addProductToCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const quantity = req.body.quantity || 1;
        const addedProduct = await cartManager.addProductToCart(cid, pid, quantity);
        res.json(addedProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};