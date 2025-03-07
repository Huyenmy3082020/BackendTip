"use strict";
const { model, Schema } = require("mongoose");

const documentName = "Comment";
const collectionName = "Comments";

const commentSchema = new Schema(
  {
    comment_productId: { type: Schema.Types.ObjectId, ref: "Product" },
    comment_userId: { type: Number, default: 1 },
    comment_content: { type: String, required: true },
    comment_left: { type: Number, default: 0 },
    comment_right: { type: Number, default: 0 },
    comment_parentId: { type: Schema.Types.ObjectId, ref: documentName },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: collectionName,
  }
);

module.exports = {
  CommentSch: model(documentName, commentSchema),
};
