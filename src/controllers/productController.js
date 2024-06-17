// productController.js
const ProductManager = require('../models/ProductManager');
const Product = require('../db').Product;
const productManager = new ProductManager('./data/products.json');
const { authorizeUser } = require('../middlewares/authorizationMiddleware');
const nodemailer = require('nodemailer');

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

            if (product.ownerRole === 'premium') {
                const owner = await User.findOne({ email: product.owner });
                const transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS,
                    },
                });

                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: owner.email,
                    subject: 'Producto eliminado',
                    text: `Su producto "${product.title}" ha sido eliminado.`,
                };

                await transporter.sendMail(mailOptions);
            }

            await product.remove();
            res.status(200).json({ message: 'Producto eliminado correctamente' });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};