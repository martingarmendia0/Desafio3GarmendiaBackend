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