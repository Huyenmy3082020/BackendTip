"use strict";
const { InventoryService } = require("../services/inventory.service");

class InventoryController {
  addStock = async (req, res) => {
    try {
      const checkoutReview = await InventoryService.addStockToInventory(
        req.body
      );
      res.status(200).json(checkoutReview);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  };
}

module.exports = new InventoryController();
