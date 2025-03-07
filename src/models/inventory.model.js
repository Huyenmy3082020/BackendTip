const mongoose = require("mongoose"); // Ensure mongoose is imported correctly
const { Schema } = mongoose;

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

const invent = mongoose.model(documentName, inventorySchema);

module.exports = invent;
