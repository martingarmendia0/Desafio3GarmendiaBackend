const ProductManager = require('../models/ProductManager');
const productManager = new ProductManager('./data/products.json');

exports.getProducts = async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const products = await productManager.getProducts();

        if (limit) {
            res.json(products.slice(0, limit));
        } else {
            res.json(products);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productManager.getProductById(parseInt(pid));

        res.json(product);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.addProduct = async (req, res) => {
    try {
        const newProduct = await productManager.addProduct(req.body);
        res.json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { pid } = req.params;
        const updatedProduct = await productManager.updateProduct(parseInt(pid), req.body);
        res.json(updatedProduct);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { pid } = req.params;
        await productManager.deleteProduct(parseInt(pid));
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};