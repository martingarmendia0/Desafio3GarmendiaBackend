const Cart = require('../dao/models/CartManager');
const Product = require('../dao/models/ProductManager');
const Ticket = require('../dao/models/Ticket');

// Función para obtener un carrito por su ID
exports.getCartById = async (cartId) => {
    return await Cart.findById(cartId);
};

// Función para verificar el stock de los productos del carrito
exports.checkStock = async (products) => {
    const productsWithInsufficientStock = [];

    for (const product of products) {
        const dbProduct = await Product.findById(product.productId);

        if (!dbProduct || dbProduct.stock < product.quantity) {
            productsWithInsufficientStock.push({ productId: product.productId, productName: dbProduct.name });
        }
    }

    return productsWithInsufficientStock;
};

// Función para realizar la compra de un carrito
exports.purchaseCart = async (cart) => {
    for (const product of cart.products) {
        const dbProduct = await Product.findById(product.productId);

        if (dbProduct) {
            dbProduct.stock -= product.quantity;
            await dbProduct.save();
        }
    }

    // Generar ticket después de realizar la compra
    const ticket = await this.generateTicket(cart);
    return ticket;
};

// Función para actualizar el carrito después de una compra
exports.updateCartAfterPurchase = async (cartId, productsPurchased) => {
    // Filtrar los productos que no fueron comprados
    const productsNotPurchased = cart.products.filter(product => !productsPurchased.includes(product.productId));

    // Actualizar el carrito con los productos que no fueron comprados
    await Cart.findByIdAndUpdate(cartId, { $set: { products: productsNotPurchased } });
};

// Función para generar un ticket de compra
exports.generateTicket = async (cart) => {
    const ticketData = {
        code: generateTicketCode(),
        purchase_datetime: new Date(),
        amount: calculateTotalAmount(cart),
        purchaser: cart.userEmail
    };

    return await Ticket.create(ticketData);
};

// Función para generar un código único para el ticket
const generateTicketCode = () => {
    return Math.random().toString(36).substr(2, 9);
};

// Función para calcular el monto total de la compra
const calculateTotalAmount = (cart) => {
    let totalAmount = 0;

    for (const product of cart.products) {
        totalAmount += product.price * product.quantity;
    }

    return totalAmount;
};

module.exports = cartService;