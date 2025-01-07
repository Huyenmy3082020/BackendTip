"use strict";

const { model, Schema, Types, Collection } = require("mongoose");
const documentName = "Shop";
const CollectionName = "Shops";

const ShopSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      maxLength: 150,
    },
    email: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    verifyToken: {
      type: String,
      default: null,
    },
    roles: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true, // Đúng là 'timestamps' không phải 'timeStamps'
    collection: CollectionName,
  }
);

const ShopModel = model(documentName, ShopSchema);

module.exports = ShopModel;
