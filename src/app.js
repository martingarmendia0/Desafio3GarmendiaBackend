const express = require('express');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = 8080;

app.use(express.json());

app.use('/', productRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});