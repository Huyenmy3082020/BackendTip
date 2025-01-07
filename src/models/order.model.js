const mongoose = require("mongoose"); // Ensure mongoose is imported correctly
const { Schema, Types } = mongoose;

const documentName = "Order";
const collectionName = "Orders";

const orderScheme = new Schema(
  {
    order_userId: { type: Number, required: true },

    order_checkout: { type: Object, default: {} },
    /*
    order_checkout ={
        total_price,
        total_ApplyDiscount,
        feeShip
    }
    */
    order_shipping: { type: Object, default: {} },
    /*
    order_shipping ={
        street,
        city,
        state,
        country,
    }
    */
    order_payment: { type: Object, default: {} },
    order_product: { type: Array, default: {} },
    order_trackingNumber: { type: String, default: "0000011123" },
    order_status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "cancle"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    collection: collectionName,
  }
);

module.exports = mongoose.model(documentName, orderScheme);
