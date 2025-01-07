const mongoose = require("mongoose"); // Ensure mongoose is imported correctly
const { Schema, Types } = mongoose;

const documentName = "ApiKey";
const collectionName = "ApiKeys";

const apiKeySchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    permission: {
      type: [String],
      required: true,
      enum: ["0000", "1111", "2222"],
    },
  },
  {
    timestamps: true,
    collection: collectionName,
  }
);

module.exports = mongoose.model(documentName, apiKeySchema);
