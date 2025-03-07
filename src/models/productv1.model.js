"use strict";

const { model, Schema, models } = require("mongoose");
const collectionName = "Products";

// Định nghĩa schema cho sản phẩm cơ bản
const productSchema = new Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_thumb: {
      type: String,
      required: true,
    },
    product_description: {
      type: String,
      required: true,
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_quantity: {
      type: Number,
      required: true,
    },
  },
  {
    collection: collectionName,
    timestamps: true,
  }
);

// Kiểm tra xem mô hình đã tồn tại chưa trước khi tạo mới
const product = models.Product || model("Product", productSchema);

module.exports = {
  product,
};
