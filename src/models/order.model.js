const mongoose = require("mongoose"); // Ensure mongoose is imported correctly
const { Schema, Types } = mongoose;

const documentName = "Order";
const collectionName = "Orders";

const orderSchema = new Schema(
  {
    order_userId: { type: Number, required: true },

    order_checkout: {
      type: Object,
      default: {},
      /*
      order_checkout = {
        total_price,
        total_ApplyDiscount,
        feeShip
      }
      */
    },
    order_shipping: {
      type: Object,
      default: {},
      /*
      order_shipping = {
        street,
        city,
        state,
        country
      }
      */
    },
    order_payment: { type: Object, default: {} },
    order_product: { type: Array, default: [] }, // Sửa default thành mảng rỗng
    order_trackingNumber: { type: String, default: "0000011123" },
    order_status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "cancelled"], // Sửa "cancle" thành "cancelled"
      default: "pending",
    },
  },
  {
    timestamps: true,
    collection: collectionName,
  }
);

const Order = mongoose.model(documentName, orderSchema); // Đổi tên biến thành Order

module.exports = Order; // Export đúng tên biến Order
