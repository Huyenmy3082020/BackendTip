const { product } = require("../models/productv1.model");

class ProductService {
  // Hàm tạo sản phẩm cơ bản
  static async createProduct(payload) {
    try {
      const newProduct = new product(payload);
      await newProduct.save();
      return newProduct;
    } catch (error) {
      console.error("Error creating product:", error);
      return null;
    }
  }
}

module.exports = ProductService;
