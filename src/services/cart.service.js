"use strict";
const { cart } = require("../models/cart.model");

class CartService {
  static async createUserCart({ shopId, product }) {
    const query = { cart_shopId: shopId, cart_state: "active" };
    const updateOnInsert = {
      $addToSet: {
        cart_products: product, // Sử dụng đúng trường (cart_products)
      },
    };
    const options = { upsert: true, new: true }; // Các tùy chọn cho findOneAndUpdate
    const updatedCart = await cart.findOneAndUpdate(
      query,
      updateOnInsert,
      options
    );
    console.log(updatedCart);
    return updatedCart;
  }

  static async updateUserCartQuantity({ shopId, product }) {
    const { productId, quantity } = product;
    const query = {
      cart_shopId: shopId,
      cart_state: "active",
      "cart_products.product_id": productId,
    };
    const updateSet = {
      $inc: {
        "cart_products.$.quantity": quantity, // Đảm bảo sử dụng đúng trường
      },
    };
    const options = { upsert: true, new: true };
    return await cart.findOneAndUpdate(query, updateSet, options);
  }

  static async addTocart({ shopId, product = {} }) {
    console.log(shopId);
    console.log(product);
    const userCart = await cart.findOne({
      cart_shopId: shopId,
      cart_state: "active",
    });

    console.log("userCart: " + userCart);
    if (!userCart) {
      return await CartService.createUserCart({ shopId, product });
    }

    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa và cập nhật số lượng
    if (!userCart.cart_products.length) {
      userCart.cart_products = [product];
      return await userCart.save();
    }

    return await CartService.updateUserCartQuantity({ shopId, product });
  }

  static async deleteUserCart({ shopId, product }) {
    const query = {
      cart_shopId: shopId,
      cart_state: "active",
    };
    const updateSet = {
      $pull: { cart_products: { product_id: product._id } },
    };
    const options = { upsert: true, new: true };
    return await cart.updateOne(query, updateSet, options);
  }

  static async getUserCart(shopId) {
    return await cart
      .findOne({ cart_shopId: shopId, cart_state: "active" })
      .lean();
  }
}

module.exports = { CartService };
