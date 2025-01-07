"use strict";
const { CheckOutService } = require("../services/checkout.service");

class CartController {
  checkoutReview = async (req, res) => {
    try {
      const checkoutReview = await CheckOutService.checkoutReview({
        ...req.body,
      });
      res.status(200).json(checkoutReview);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  };
}

module.exports = new CartController();
