"use strict";

const mongoose = require("mongoose");
const ProductModel = require("../models/product.model");
const {
  product,
  clothing,
  electronics,
  furniturer,
} = require("../models/product.model");
const {
  findAll,
  publicForShop,
  findAllPublishShop,
  findAllDraftsShop,
  unPublishProductForShop,
  searchProduct,
  updateProductById,
} = require("../models/repository/product.repo");
const { removeUndefinedObject, updateNestedObject } = require("../utils");
const insertInventory = require("../models/repository/inventory.repo");

class ProductFactory {
  // static async createProduct(type, payload) {
  //   switch (type) {
  //     case "clothing":
  //       return await new Clothing(payload).createProduct();
  //     case "electronics":
  //       return await new Electronics(payload).createProduct();
  //     default:
  //       throw new Error("Invalid product type");
  //   }
  // }

  // khai bao strategy
  static productRegister = {};

  static registerProductType(type, classRef) {
    ProductFactory.productRegister[type] = classRef;
  }

  static async createProduct(type, productData) {
    const ProductClass = ProductFactory.productRegister[type];
    if (!ProductClass) {
      throw new Error(`Product type ${type} is not registered.`);
    }
    return new ProductClass(productData).createProduct();
  }

  static async updateProduct(type, productId, productData) {
    const ProductClass = ProductFactory.productRegister[type];
    if (!ProductClass) {
      throw new Error(`Product type ${type} is not registered.`);
    }
    return new ProductClass(productData).updateProduct(productId, productData);
  }

  static async publishProductForShop({ product_shop, product_id }) {
    return await publicForShop(product_shop, product_id);
  }
  static async unPublishProductForShop({ product_shop, product_id }) {
    return await unPublishProductForShop(product_shop, product_id);
  }

  static async findAll({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAll(query, skip, limit);
  }

  static async findAllDraftsShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftsShop({ query, limit, skip });
  }

  static async findAllPublishShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: false };
    return await findAllPublishShop({ query, limit, skip });
  }
  static searchProduct = async (keySearch) => {
    return await searchProduct(keySearch);
  };

  static async findAllProduct({
    limit = 50,
    sort = "ctime",
    page = 1,

    filter = { isPublished: true },
  }) {
    return await findAllProduct({
      limit,
      sort,
      filter,
      page,
      select: [
        "product_name",
        "product_thumb",
        "product_description",
        "product_price",
        "product_quantity",
        "product_type",
      ],
    });
  }
  static async findOneProduct({ product_id }) {
    return await findById({ product_id, unSelect: ["___v"] });
  }
}
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_type,
    product_shop,
    product_attributes,
    product_quantity,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  async createProduct(product_id) {
    try {
      const createdProduct = await product.create({
        ...this,
        _id: product_id,
      });
      if (createdProduct) {
        await insertInventory({
          product_id: createdProduct._id,
          shopId: this.product_shop,
          stock: this.product_quantity,
        });
      }
      //push notification
      // tach roi cac mo hinh khac , gui du lieu
      pushNotiToSystem({
        type: "Shop--001",
        receiverId: 1,
        senderId: this.product_shop,
        options: {
          product_name: this.product,
          shop_name: this.product_shop,
        },
      })
        .then((re = console.log(res)))
        .catch(console.error);
      return createdProduct;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  }
  async updateProduct(product_id, productData) {
    console.log("Updating product with data:", productData);
    console.log("ProductId:", product_id);
    return await updateProductById({ product_id, productData, model: product });
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) {
      throw new Error("Error creating clothing product");
    }
    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) {
      throw new Error("Error creating product");
    }
    return newProduct;
  }

  async updateProduct(product_id) {
    const objParams = removeUndefinedObject(this);
    if (objParams.product_attributes) {
      await updateProductById({
        product_id,
        productData: updateNestedObject(objParams.product_attributes),
        model: clothing,
      });
    }
    const updateProduct = await super.updateProduct(
      product_id,
      updateNestedObject(objParams)
    );
    return updateProduct;
  }
}

class Electronics extends Product {
  async createProduct() {
    try {
      // Log thông tin tạo sản phẩm điện tử
      console.log(
        "Creating new electronics with attributes:",
        this.product_attributes
      );
      console.log("Product shop:", this.product_shop);

      const newElectronics = await electronics.create({
        ...this.product_attributes,
        product_shop: this.product_shop,
      });

      // Kiểm tra nếu không tạo được sản phẩm điện tử
      if (!newElectronics) {
        throw new Error("Error creating electronics product");
      }

      // Log kết quả sau khi tạo sản phẩm điện tử
      console.log("New electronics created:", newElectronics);

      // Tạo sản phẩm chính
      const newProduct = await super.createProduct(newElectronics._id);

      // Kiểm tra nếu không tạo được sản phẩm chính
      if (!newProduct) {
        throw new Error("Error creating product");
      }

      // Log kết quả sau khi tạo sản phẩm chính
      console.log("New product created:", newProduct);

      return newProduct;
    } catch (error) {
      // Log bất kỳ lỗi nào xảy ra
      console.error("Error in createProduct:", error);
      throw error;
    }
  }

  async updateProduct(product_id) {
    try {
      // Log thông tin trước khi cập nhật
      console.log("Updating product with ID:", product_id);
      console.log("Current product attributes:", this.product_attributes);

      const objParams = removeUndefinedObject(this);

      if (objParams.product_attributes) {
        // Log trước khi cập nhật sản phẩm điện tử
        console.log(
          "Updating electronics attributes:",
          objParams.product_attributes
        );
        await updateProductById({
          product_id,
          productData: updateNestedObject(objParams.product_attributes),
          model: electronics,
        });
      }

      // Log trước khi cập nhật sản phẩm chính
      console.log("Updating main product with:", updateNestedObject(objParams));
      const updateProduct = await super.updateProduct(
        product_id,
        updateNestedObject(objParams)
      );

      // Log kết quả sau khi cập nhật sản phẩm
      console.log("Updated product:", updateProduct);

      return updateProduct;
    } catch (error) {
      // Log bất kỳ lỗi nào xảy ra trong quá trình cập nhật
      console.error("Error in updateProduct:", error);
      throw error;
    }
  }
}

ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Product", Product);
ProductFactory.registerProductType("Electronics", Electronics);

module.exports = ProductFactory;
