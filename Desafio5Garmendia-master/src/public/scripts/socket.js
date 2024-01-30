// public/scripts/socket.js

document.addEventListener('DOMContentLoaded', () => {
  const socket = io();

  function updateProductList(products) {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';

    if (Array.isArray(products)) {
      products.forEach(product => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${product.title}</strong>
                         <p>${product.description}</p>
                         <p>Price: $${product.price}</p>
                         <p>Stock: ${product.stock}</p>`;
        productList.appendChild(li);
      });
    } else {
      console.error('El formato de los productos no es un array:', products);
    }
  }

  const form = document.getElementById('productForm');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const title = document.getElementsByName('title')[0].value;
    const description = document.getElementsByName('description')[0].value;
    const price = document.getElementsByName('price')[0].value;
    const stock = document.getElementsByName('stock')[0].value;

    socket.emit('addProduct', { title, description, price, stock });
  });

  socket.on('productUpdated', (data) => {
    // Actualiza la interfaz de usuario con los productos actualizados
    updateProductList(data.products);
  });
});