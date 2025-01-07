const mongoose = require("mongoose"); // Đảm bảo mongoose đã được import đúng
const { Schema, model } = mongoose;

// Mô hình Discount
const documentName = "Discount";
const collectionName = "Discounts";

const discountSchema = new Schema(
  {
    discount_name: {
      type: String,
      required: true,
    },
    discount_description: {
      type: String,
      required: true,
    },
    discount_type: {
      type: String,
      default: "fixed_amount",
    },
    discount_value: {
      type: Number,
      required: true,
    },
    discount_code: {
      type: String,
      required: true,
    },
    discount_startDate: {
      type: Date,
      required: true,
    },
    discount_endDate: {
      type: Date,
      required: true,
    },
    discount_max_uses: {
      type: Number,
      required: true,
    },
    discount_uses_count: {
      type: Number,
      default: 0,
    },
    discount_users_used: {
      type: Array,
      default: [],
    },
    discount_max_user_per: {
      type: Number,
      required: true,
    },
    discount_min_order_value: {
      type: Number,
      required: true,
    },
    discount_shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    discount_isActive: {
      type: Boolean,
      default: true,
    },
    discount_applies_to: {
      type: String,
      required: true,
      enum: ["all", "specific_products"],
    },
    discount_product_ids: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: collectionName,
  }
);

// Xuất mô hình Discount
const DiscountModel = model(documentName, discountSchema);

module.exports = DiscountModel;
