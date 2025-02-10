export default class ProductManager {
  constructor() {
    this.products = [];
  }

  async getAllProducts(limit) {
    if (limit) {
      return this.products.slice(0, limit);
    }
    return this.products;
  }

  async getProductById(id) {
    return this.products.find((product) => product.id === id);
  }

  async addProduct(product) {
    const newProduct = {
      id: this.products.length
        ? this.products[this.products.length - 1].id + 1
        : 1,
      ...product,
      status: true,
    };
    this.products.push(newProduct);
    return newProduct.id;
  }

  async updateProduct(id, updateFields) {
    const productIndex = this.products.findIndex(
      (product) => product.id === id
    );
    if (productIndex === -1) return null;

    const updateProduct = {
      ...this.products[productIndex],
      ...updateFields,
      id: this.products[productIndex].id,
    };
    this.products[productIndex] = updateProduct;
    return updateProduct;
  }

  async deleteProduct(id) {
    const productIndex = this.products.findIndex(
      (product) => product.id === id
    );
    if (productIndex == -1) return null;
    const deletedProduct = this.products.splice(productIndex, 1);
    return deletedProduct[0];
  }
}
