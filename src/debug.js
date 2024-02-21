try {
    const products = require ('./data/products.json');
    console.log('Productos importados correctamente:', products);
  } catch (error) {
     console.error('Error al importar productos:', error);
  }