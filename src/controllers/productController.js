// productController.js

const ProductManager = require('../models/ProductManager');
const Product = require('../db').Product; // Importar el modelo de Producto
const productManager = new ProductManager('./data/products.json');
const { authorizeUser } = require('../middlewares/authorizationMiddleware');

exports.getProducts = async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const sort = req.query.sort;
        const query = req.query.query;

        const result = await productManager.getProducts({ limit, page, sort, query });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productManager.getProductById(parseInt(pid));
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.modifyProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { user } = req;
        const { owner, title, description, price } = req.body;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'El producto no existe' });
        }

        // Validar permisos utilizando el middleware authorizeUser
        authorizeUser(['admin', 'premium'])(req, res, async () => {
            if (user.role === 'premium' && product.owner !== user.email) {
                return res.status(403).json({ error: 'No tienes permiso para modificar este producto' });
            }

            product.title = title;
            product.description = description;
            product.price = price;

            await product.save();

            res.status(200).json({ message: 'Producto modificado correctamente' });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { user } = req;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'El producto no existe' });
        }

        // Validar permisos utilizando el middleware authorizeUser
        authorizeUser(['admin', 'premium'])(req, res, async () => {
            if (user.role === 'premium' && product.owner !== user.email) {
                return res.status(403).json({ error: 'No tienes permiso para borrar este producto' });
            }

            await product.remove();

            res.status(200).json({ message: 'Producto eliminado correctamente' });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};