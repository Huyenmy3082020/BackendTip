"use strict";
const { model, Schema } = require("mongoose");

const documentName = "Cart";
const collectionName = "Carts";

const cartSchema = new Schema(
  {
    cart_state: {
      type: String,
      required: true,
      enum: ["active", "inactive", "complete", "pending"],
      default: "active",
    },
    cart_products: { type: Array, required: true },
    cart_count_products: { type: Number, default: 0 },
    cart_shopId: { type: String, required: true },
    collectionName: { type: String, default: collectionName },
  },
  {
    timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" }, // Đổi tên các trường thời gian
  }
);

module.exports = {
  cart: model(documentName, cartSchema),
};
