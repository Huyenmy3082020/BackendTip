"use strict";
const invent = require("../models/inventory.model");
const { getProductById } = require("../models/repository/product.repo");

class InventoryService {
  static async addStockToInventory({
    stock,
    productId,
    shopId,
    location = "laoasda",
  }) {
    const product = await getProductById(productId);
    if (!product) {
      throw new Error("Product not found");
    }
    console.log(product);
    const query = {
        inven_shopId: shopId,
        inven_productId: productId,
      },
      updateSet = {
        $inc: {
          inven_stock: stock,
        },
        $set: {
          inven_location: location,
        },
      },
      options = { upsert: true, new: true };
    return await invent.findOneAndUpdate(query, updateSet, options);
  }
}
module.exports = InventoryService;
