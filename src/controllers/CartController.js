const CartManager = require('../models/CartManager');
const cartManager = new CartManager('../data/carts.json');
const TicketService = require('../services/TicketService');

const purchaseCart = async (req, res) => {
    const cartId = req.params.cid;
    const purchaserEmail = req.user.email; // Obtén el correo del comprador
    const purchaseAmount = req.body.amount; // Obtén el monto total de la compra

    try {
        // Genera el ticket con los datos de la compra
        const ticket = await TicketService.generateTicket(cartId, purchaserEmail, purchaseAmount);

        // Actualiza el carrito y filtra los productos que no pudieron comprarse
        // (deja solo los productos que no se compraron)
        await CartService.updateCartAfterPurchase(cartId);

        res.status(200).json({ message: 'Compra realizada con éxito', ticket });
    } catch (error) {
        console.error('Error al finalizar la compra:', error);
        res.status(500).json({ error: 'Error al finalizar la compra' });
    }
};

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
        res.status(500).json({ error: error.message });
    }
};

exports.addProductToCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const quantity = req.body.quantity || 1;
        const addedProduct = await cartManager.addProductToCart(cid, pid, quantity);
        res.json(addedProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteProductFromCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        await cartManager.deleteProductFromCart(cid, pid);
        res.json({ message: 'Product deleted from cart successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProductQuantityInCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const quantity = req.body.quantity;
        const updatedProduct = await cartManager.updateProductQuantityInCart(cid, pid, quantity);
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteAllProductsFromCart = async (req, res) => {
    try {
        const { cid } = req.params;
        await cartManager.deleteAllProductsFromCart(cid);
        res.json({ message: 'All products deleted from cart successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    purchaseCart
};