const fs = require('fs').promises;

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
  }

  async addProduct(product) {
    const products = await this.readProductsFromFile();
    const newProduct = { id: this.generateId(products), ...product };
    products.push(newProduct);
    await this.writeProductsToFile(products);
    return newProduct;
  }

  generateId(products) {
    const maxId = products.reduce((max, p) => (p.id > max ? p.id : max), 0);
    return maxId + 1;
  }

  async getProducts() {
    return await this.readProductsFromFile();
  }

  async getProductById(id) {
    const products = await this.readProductsFromFile();
    const product = products.find((p) => p.id == id); // Convert id to string for comparison
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  async updateProduct(id, updatedFields) {
    const products = await this.readProductsFromFile();
    const index = products.findIndex((p) => p.id == id); // Convert id to string for comparison
    if (index === -1) {
      throw new Error('Product not found');
    }
    products[index] = { ...products[index], ...updatedFields };
    await this.writeProductsToFile(products);
    return products[index];
  }

  async deleteProduct(id) {
    let products = await this.readProductsFromFile();
    const updatedProducts = products.filter((p) => p.id != id); // Convert id to string for comparison
    if (updatedProducts.length === products.length) {
      throw new Error('Product not found');
    }
    await this.writeProductsToFile(updatedProducts);
  }

  async readProductsFromFile() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async writeProductsToFile(products) {
    try {
      await fs.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8');
    } catch (error) {
      throw new Error('Error writing to file');
    }
  }
}

module.exports = ProductManager;