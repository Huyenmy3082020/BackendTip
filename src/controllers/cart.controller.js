"use strict";
const { CartService } = require("../services/cart.service");

class CartController {
  addToCart = async (req, res, next) => {
    try {
      const cart = await CartService.addTocart(req.body);
      return res.json(cart);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error adding product to cart" });
    }
  };

  updateCart = async (req, res, next) => {
    try {
      const cart = await CartService.updateCart(req.params.id, req.body);
      return res.json(cart);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error updating cart" });
    }
  };

  deleteCart = async (req, res, next) => {
    try {
      await CartService.deleteUserCart(req.body);
      return res.json({
        message: "Cart deleted successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error deleting cart" });
    }
  };

  listToCart = async (req, res, next) => {
    try {
      const listTocart = await CartService.getUserCart(req.body.shopId);
      return res.json({
        code: "200",
        data: listTocart,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error retrieving cart" });
    }
  };
}

module.exports = new CartController();
