const CartManager = require('../models/CartManager');
const cartManager = new CartManager('../data/carts.json');
const cartService = require('../services/cartService');
const TicketService = require('../services/TicketService');

const purchaseCart = async (req, res) => {
    const cartId = req.params.cid;
    const purchaserEmail = req.user.email; // Obtén el correo del comprador
    const purchaseAmount = req.body.amount; // Obtén el monto total de la compra

    try {
        // Verifica el stock de los productos en el carrito
        const cart = await cartManager.getCartById(cartId);
        const productsWithInsufficientStock = await cartService.checkStock(cart.products);
        
        if (productsWithInsufficientStock.length > 0) {
            return res.status(400).json({ error: 'Insufficient stock for some products in the cart', productsWithInsufficientStock });
        }

        // Genera el ticket con los datos de la compra
        const ticket = await TicketService.generateTicket(cartId, purchaserEmail, purchaseAmount);

        // Actualiza el carrito y filtra los productos que no pudieron comprarse
        // (deja solo los productos que no se compraron)
        await cartService.updateCartAfterPurchase(cartId);

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
        const cart = await cartManager.getCartById(cid);
        res.json(cart.products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addProductToCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const quantity = req.body.quantity || 1;

        // Verifica si el producto existe y tiene suficiente stock
        const product = await cartManager.getProductById(pid);
        if (!product || product.stock < quantity) {
            return res.status(400).json({ error: 'Product not found or insufficient stock' });
        }

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