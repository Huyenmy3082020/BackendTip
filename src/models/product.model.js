"use strict";

const { model, Schema, Types } = require("mongoose");
const slugify = require("slugify");
const documentName = "Product";
const collectionName = "Products";

// danh index

const productSchema = new Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_thumb: {
      type: String,
      required: true,
    },
    product_description: {
      type: String,
      required: true,
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_quantity: {
      type: Number,
      required: true,
    },
    product_type: {
      type: String,
      required: true,
      enum: ["Electronics", "Clothing", "Firmware"],
    },
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    product_attributes: {
      type: Schema.Types.Mixed,
      required: true,
    },
    product_slug: {
      type: String,
    },
    product_ratingAverage: {
      type: Number,
      default: 4.5,
    },
    product_variation: {
      type: Array,
      default: [],
    },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: true, index: true },
  },

  {
    collection: collectionName,
    timestamps: true,
  }
);

// middleware document
productSchema.pre("save", function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
});

productSchema.index({
  product_name: "text",
  product_description: "text",
});

const clothingSchema = new Schema(
  {
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },

    brand: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    material: {
      type: String,
      required: true,
    },
  },
  {
    collection: "Clothes",
    timestamps: true,
  }
);

const electronicSchema = new Schema(
  {
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    manufacturer: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
  },
  {
    collection: "Electronics",
    timestamps: true,
  }
);

const furnitureSchema = new Schema(
  {
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    brand: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    material: {
      type: String,
      required: true,
    },
  },
  {
    collection: "Electronics",
    timestamps: true,
  }
);

module.exports = {
  product: model(documentName, productSchema),
  clothing: model("Clothing", clothingSchema),
  electronics: model("Electronics", electronicSchema),
  furniture: model("Furniture", furnitureSchema),
};
