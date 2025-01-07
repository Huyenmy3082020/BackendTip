const mongoose = require("mongoose"); // Ensure mongoose is imported correctly
const { Schema, Types } = mongoose;

const documentName = "Inventory";
const collectionName = "Inventories";

const inventorySchema = new Schema(
  {
    inven_productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    inven_location: {
      type: String,
      default: "unknown",
    },
    inven_stock: {
      type: Number,
      required: true,
    },
    inven_shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    inven_reservations: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: collectionName,
  }
);

module.exports = mongoose.model(documentName, inventorySchema);
