"use strict";
const { model, Schema } = require("mongoose");

const documentName = "Notification";
const collectionName = "Notifications";
// Order--001 : order susses
// Order--002 : order failed
// promotion-001 : new promotion
// shop-001 : new product by follow

const notificationSchema = new Schema(
  {
    noti_type: {
      type: String,
      enum: ["Order", "Order--001", "Promotion", "Shop--001"],
      required: true,
    },
    noti_sendId: { type: String, required: true },
    noti_receiveId: { type: Number, required: true },
    noti_content: { type: String, required: true },
    noti_option: { type: Object, required: true },
  },

  {
    timestamps: true,
    collection: collectionName,
  }
);

module.exports = {
  notification: model(documentName, notificationSchema),
};
