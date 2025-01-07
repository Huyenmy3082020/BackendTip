"use strict";

const { Schema, model } = require("mongoose");

const documentName = "Key";
const collectionName = "Keys";

const keyTokenSchema = new Schema(
  {
    publicKey: {
      type: String,
      required: true,
    },
    privateKey: {
      type: String,
      required: true,
    },
    shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    refreshTokenUsed: {
      type: Array,
      default: [],
    },
    refreshToken: {
      type: String,
      required: true,
    },
  },
  {
    collection: collectionName,
    timestamps: true,
  }
);

module.exports = model(documentName, keyTokenSchema);
