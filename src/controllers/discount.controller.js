"use strict";
const DiscountService = require("../services/discount.service");
class DiscountController {
  createDiscountCode = async (req, res, next) => {
    try {
      const result = await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      });

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };
  getAllDiscountCodesByShop = async (req, res, next) => {
    try {
      const result = await DiscountService.getAllDiscountCodesByShop({
        ...req.query,
      });
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  getDiscountAmount = async (req, res, next) => {
    try {
      const result = await DiscountService.getDiscountAmount({ ...req.body });
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
  getAllDiscountCodeWidthProduct = async (req, res, next) => {
    try {
      const result = await DiscountService.getDiscountCodeWithProduct({
        ...req.query,
      });
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
  cancleDiscountCodeWidthProduct = async (req, res, next) => {
    try {
      const result = await DiscountService.cancleDiscountCode({
        ...req.body,
      });
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new DiscountController();
