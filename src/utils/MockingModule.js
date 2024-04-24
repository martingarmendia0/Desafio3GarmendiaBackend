// MockingModule.js
const express = require('express');
const router = express.Router();

router.get('/mockingproducts', (req, res) => {
    // Generar 100 productos simulados (mocks) con el mismo formato que los productos reales
    const mockedProducts = generateMockedProducts(100);
    res.json(mockedProducts);
});

// Función para generar productos simulados
const generateMockedProducts = (count) => {
    const mockedProducts = [];
    for (let i = 0; i < count; i++) {
        const product = {
            title: `Product ${i + 1}`,
            price: Math.floor(Math.random() * 100) + 1, // Precio aleatorio entre 1 y 100
            // Agregar más propiedades si es necesario para simular un producto real
        };
        mockedProducts.push(product);
    }
    return mockedProducts;
};

module.exports = router;