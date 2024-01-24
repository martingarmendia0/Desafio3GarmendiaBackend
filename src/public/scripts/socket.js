// public/scripts/socket.js

document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
  
    const form = document.getElementById('productForm');
  
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const title = document.getElementsByName('title')[0].value;
      const description = document.getElementsByName('description')[0].value;
      const price = document.getElementsByName('price')[0].value;
  
      socket.emit('addProduct', { title, description, price });
    });
  
    socket.on('productUpdated', (updatedProducts) => {
      // Aquí puedes actualizar la interfaz de usuario con los productos actualizados
    });
  });  