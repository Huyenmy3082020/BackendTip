"use strict";

const { findCartById } = require("../models/repository/cart.repo");
const { checkProductByServer } = require("../models/repository/product.repo");
const { getDiscountAmount } = require("./discount.service");
const { acquireLock, releaseLock } = require("./redis.service");
const Order = require("../models/order.model");
class CheckOutService {
  static async checkoutReview({ cartId, userId, shop_order_ids = [] }) {
    // tìm giỏ hàng dựa trên cartID
    const foundCart = await findCartById(cartId);
    if (!foundCart) {
      throw new Error("Cart not found");
    }

    const checkout_order = {
      total_price: 0, // tổng tiền hàng
      feeShip: 0, // phí vận chuyển
      totalDiscount: 0, // tổng tiền giảm giá
      totalCheckout: 0, // tổng thanh toán
    };

    const shop_order_ids_new = [];

    // Tính tổng tiền cho mỗi đơn hàng shop
    for (let i = 0; i < shop_order_ids.length; i++) {
      const {
        shopId,
        shop_discount = [],
        items_products = [],
      } = shop_order_ids[i];

      // Kiểm tra tính có sẵn của sản phẩm
      const checkProduct = await checkProductByServer(items_products);

      if (checkProduct.length === 0) {
        throw new Error(`Product is not available at shopId ${shopId}`);
      }

      // Tính tổng tiền cho các sản phẩm trong shop
      const checkoutPrice = checkProduct.reduce((acc, product) => {
        console.log("Processing product:", product);
        return acc + product.price * product.quantity;
      }, 0);

      // Tổng tiền hàng
      checkout_order.total_price += checkoutPrice;

      const itemCheckOut = {
        shopId,
        priceRaw: checkoutPrice, // Tiền trước khi giảm giá
        shop_discount,
        priceAppylyDiscount: checkoutPrice,
        items_products: checkProduct,
      };

      // Kiểm tra discount và tính toán
      if (shop_discount.length > 0) {
        const { totalPrice = 0, discountAmount = 0 } = await getDiscountAmount({
          codeId: shop_discount[0].codeId,
          shopId,
          products: checkProduct,
        });

        // Tổng discount
        checkout_order.totalDiscount += totalPrice;

        if (discountAmount > 0) {
          itemCheckOut.priceAppylyDiscount = checkoutPrice - discountAmount;
        }
      }

      // Tổng thanh toán cuối cùng
      checkout_order.totalCheckout += itemCheckOut.priceAppylyDiscount;

      shop_order_ids_new.push(itemCheckOut);
    }

    return {
      checkout_order,
      shop_order_ids,
      shop_order_ids_new,
    };
  }

  // hàm order
  static async OrderByUser({
    shop_order_ids,
    cartId,
    userId,
    userAddresses = {},
    userPaymentMethods = {},
  }) {
    try {
      console.log(
        "cartId:",
        cartId,
        "userId:",
        userId,
        "userAddresses:",
        userAddresses
      );

      if (
        !cartId ||
        !userId ||
        !shop_order_ids ||
        shop_order_ids.length === 0
      ) {
        throw new Error("Thiếu thông tin đầu vào.");
      }

      // Kiểm tra sản phẩm trong giỏ hàng
      const { shop_order_ids_new, checkout_order } =
        await CheckOutService.checkoutReview({
          cartId,
          userId,
          shop_order_ids,
        });

      // Lấy ra tất cả các sản phẩm
      const product = shop_order_ids.flatMap((order) => order.items_products);
      const acquireProduct = [];

      for (let i = 0; i < product.length; i++) {
        const { productId, quantity } = product[i];

        // Sử dụng optimistic lock để kiểm tra tồn kho
        const keyLock = await acquireLock(productId, quantity, cartId);
        acquireProduct.push(keyLock ? true : false);

        if (keyLock) {
          // Giải phóng lock ngay sau khi kiểm tra
          await releaseLock(keyLock);
        }
      }

      // Nếu tất cả sản phẩm đều còn hàng
      if (!acquireProduct.includes(false)) {
        const newOrder = await Order.create({
          order_userId: userId,
          order_checkout: checkout_order,
          order_shipping: userAddresses,
          order_payment: userPaymentMethods,
          order_product: shop_order_ids_new,
        });

        if (newOrder) {
          console.log("Đơn hàng đã tạo thành công:", newOrder);

          // Xóa sản phẩm khỏi giỏ hàng sau khi đặt hàng thành công
          for (const shopOrder of shop_order_ids_new) {
            const shopId = shopOrder.shopId;
            for (const product of shopOrder.items_products) {
              const { productId } = product;
              await Cart.deleteOne({
                cartId,
                "items.shopId": shopId,
                "items.productId": productId,
              });
            }
          }

          console.log("Đã xóa sản phẩm khỏi giỏ hàng.");
        }

        return newOrder;
      } else {
        throw new Error(
          "Có sản phẩm hết hàng trong kho, vui lòng kiểm tra lại."
        );
      }
    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error);
      throw error;
    }
  }

  /*
  
  */
  //user lấy tổng đơn hàng
  static async getOrderByUser() {}
  // lay ra 1 order
  static async getOneOrderByUser() {}
  // huy don hang
  static async cancelOrderByUser() {}
  // update order by admin
  static async updateOrderByAdmin() {}
}
module.exports = { CheckOutService };
