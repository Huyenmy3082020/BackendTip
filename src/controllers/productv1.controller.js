"use strict";

const ProductService = require("../services/productv1.service");

class ProductController {
  createProduct1 = async (req, res, next) => {
    try {
      const product = await ProductService.createProduct(req.body);
      console.log(product);
      return res.status(200).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      next(error);
    }
  };
}

module.exports = new ProductController();
