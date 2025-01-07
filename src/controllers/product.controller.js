"use strict";

const ProductService = require("../services/product.service");

class ProductController {
  createProduct1 = async (req, res, next) => {
    try {
      const { product_type } = req.body;
      const product = await ProductService.createProduct(
        product_type,
        req.body
      );

      return res.status(200).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      next(error);
    }
  };

  getAllProducts = async (req, res, next) => {
    try {
      const products = await ProductService.findAll({
        product_shop: req.user.userId,
      });
      return res.status(200).json(products);
    } catch (error) {
      console.error("Error getting products:", error);
      next(error);
    }
  };

  getAllPublishProducts = async (req, res, next) => {
    try {
      const products = await ProductService.findAllPublishShop({
        product_shop: req.user.userId,
      });
      return res.status(200).json(products);
    } catch (error) {
      console.error("Error getting products:", error);
      next(error);
    }
  };
  getUnPublishProducts = async (req, res, next) => {
    try {
      const products = await ProductService.unPublishProductForShop({
        product_shop: req.user.userId,
      });
      return res.status(200).json(products);
    } catch (error) {
      console.error("Error getting products:", error);
      next(error);
    }
  };

  publicProductByShop = async (req, res, next) => {
    try {
      const { id } = req.params;
      const modifiedCount = await ProductService.publishProductForShop({
        product_shop: req.user.userId,
        product_id: id,
      });
      return res.status(200).json({ modifiedCount });
    } catch (error) {
      console.error("Error publishing product:", error);
      next(error);
    }
  };

  getAllDraftProducts = async (req, res, next) => {
    try {
      const products = await ProductService.findAllDraftsShop({
        product_shop: req.user.userId,
      });
      return res.status(200).json(products);
    } catch (error) {
      console.error("Error getting products:", error);
      next(error);
    }
  };
  getListSearchProduct = async (req, res, next) => {
    try {
      console.log("req.params.", req.params);
      const products = await ProductService.searchProduct(req.params);

      return res.status(200).json(products);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
      next(error);
    }
  };

  findAllProducts = async (req, res, next) => {
    try {
      const products = await ProductService.findAllProduct(req.query);
      return res.status(200).json(products);
    } catch (error) {
      console.error("Error getting products:", error);
      next(error);
    }
  };

  findByid = async (req, res, next) => {
    try {
      const product = await ProductService.findOneProduct(req.params.id);
      return res.status(200).json(product);
    } catch (error) {
      console.error("Error getting product:", error);
      next(error);
    }
  };
  updateProduct = async (req, res, next) => {
    try {
      const product = await ProductService.updateProduct(
        req.body.product_type,
        req.params.productId,
        {
          product_shop: req.user.userId,
          ...req.body,
        }
      );

      return res.status(200).json(product);
    } catch (error) {
      console.error("Error updating product:", error);
      next(error);
    }
  };
}

module.exports = new ProductController();
