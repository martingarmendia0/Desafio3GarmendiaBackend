const fs = require('fs').promises;

class CartManager {
    constructor(filePath) {
        this.path = filePath;
    }

    async createCart() {
        const carts = await this.readCartsFromFile();
        const newCart = { id: this.generateId(carts), products: [] };
        carts.push(newCart);
        await this.writeCartsToFile(carts);
        return newCart;
    }

    async getCartProducts(cartId) {
        const carts = await this.readCartsFromFile();
        const cart = carts.find(c => c.id === cartId);

        if (!cart) {
            throw new Error('Cart not found');
        }

        return cart.products;
    }

    async addProductToCart(cartId, productId, quantity) {
        const carts = await this.readCartsFromFile();
        const cart = carts.find(c => c.id === cartId);

        if (!cart) {
            throw new Error('Cart not found');
        }

        const existingProduct = cart.products.find(p => p.id === productId);

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ id: productId, quantity });
        }

        await this.writeCartsToFile(carts);
        return cart.products;
    }

    generateId(carts) {
        const maxId = carts.reduce((max, c) => (c.id > max ? c.id : max), 0);
        return maxId + 1;
    }

    async readCartsFromFile() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async writeCartsToFile(carts) {
        try {
            await fs.writeFile(this.path, JSON.stringify(carts, null, 2), 'utf-8');
        } catch (error) {
            throw new Error('Error writing to file');
        }
    }
}

module.exports = CartManager;