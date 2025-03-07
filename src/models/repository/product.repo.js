"use strict";

const {
  product,
  electronics,
  clothing,
} = require("../../models/product.model");
const { Types } = require("mongoose");
const { ObjectId } = require("mongodb");
const { getSelectData, ungetSelectData } = require("../../utils");

const findAll = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const publicForShop = async (product_shop, product_id) => {
  const foundShop = await product.findOne({
    _id: new ObjectId(product_id),
  });
  console.log("Found product:", foundShop);

  if (!foundShop) {
    throw new Error("Product not found");
  }

  foundShop.isDraft = false;
  foundShop.isPublished = true;

  const modifiedCount = await foundShop.updateOne(foundShop);
  return modifiedCount;
};

const queryProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email")
    .sort({ updatedAt: -1 })
    .limit(limit)
    .skip(skip)
    .lean()
    .exec();
};

const findAllDraftsShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const findAllPublishShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};
const unPublishProductForShop = async ({ query, limit, skip }) => {
  const foundShop = await product.findOne({
    _id: new ObjectId(product_id),
  });
  console.log("Found product:", foundShop);

  if (!foundShop) {
    throw new Error("Product not found");
  }

  foundShop.isDraft = true;
  foundShop.isPublished = false;

  const modifiedCount = await foundShop.updateOne(foundShop);
  return modifiedCount;
};
const searchProduct = async (keySearch) => {
  console.log("Key search:", keySearch.keySearch);
  const result = await product
    .find(
      {
        $text: { $search: keySearch.keySearch }, // Truyền chuỗi vào đây
      },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .lean();

  return result;
};

const findAllProduct = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: -1 };
  const products = await product
    .find(filter, select)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();

  return products;
};

const findById = async ({ product_id, unSelect }) => {
  return await product
    .findById(product_id)
    .select(ungetSelectData(unSelect))
    .lean();
};

const updateProductById = async ({
  product_id,
  productData,
  model,
  isNew = true,
}) => {
  return await model.findByIdAndUpdate(product_id, productData, { new: isNew });
};
const getProductById = async (productId) => {
  return await product.findById(productId).lean();
};
const checkProductByServer = async (products) => {
  return await Promise.all(
    products.map(async (product) => {
      const foundProduct = await getProductById(product.productId);

      if (!foundProduct) {
        console.error(`Product not found: ${product.productId}`);
        return null; // Trả về null nếu không tìm thấy sản phẩm
      }

      return {
        price: foundProduct.product_price,
        quantity: product.quantity,
        productId: product.productId,
      };
    })
  ).then((results) => results.filter((product) => product !== null)); // Loại bỏ null
};
const findProduct = async (productId) => {
  return await product.findById(productId).lean();
};
module.exports = {
  findAll,
  publicForShop,
  findAllPublishShop,
  findAllDraftsShop,
  unPublishProductForShop,
  searchProduct,
  findAllProduct,
  findById,
  updateProductById,
  getProductById,
  checkProductByServer,
  findProduct,
};
