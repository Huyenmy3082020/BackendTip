"use strict";
const DiscountModel = require("../models/discount.model");
const { product } = require("../models/product.model");

const {
  checkDiscountExists,
  getAllDiscountCodeByShop,
  findAllDiscountCodeSelect,
} = require("../models/repository/discount.repo");
const { findAllProduct } = require("../models/repository/product.repo");
const { convertToObjectIdMongodb } = require("../utils");

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      discount_name,
      discount_description,
      discount_type,
      discount_value,
      discount_code,
      discount_startDate,
      discount_endDate,
      discount_max_uses,
      discount_max_user_per,
      discount_min_order_value,
      discount_applies_to,
      discount_product_ids,
      shopId,
    } = payload;

    console.log("asdasd", payload);
    const codePattern = /^[A-Za-z0-9]{6,10}$/;
    if (!codePattern.test(discount_code)) {
      throw new Error(
        "Mã giảm giá không hợp lệ. Mã phải có từ 6 đến 10 ký tự và chỉ chứa chữ và số."
      );
    }

    const now = new Date();
    if (now >= new Date(discount_startDate)) {
      throw new Error("Ngày bắt đầu phải lớn hơn ngày hiện tại.");
    }
    if (now >= new Date(discount_endDate)) {
      throw new Error("Ngày kết thúc phải lớn hơn ngày hiện tại.");
    }
    if (new Date(discount_startDate) >= new Date(discount_endDate)) {
      throw new Error("Ngày kết thúc phải lớn hơn ngày bắt đầu.");
    }

    if (discount_max_uses < 1) {
      throw new Error("Số lượt sử dụng tối đa phải lớn hơn hoặc bằng 1.");
    }

    const foundDiscount = await checkDiscountExists(DiscountModel, {
      discount_code,
      discount_shopId: convertToObjectIdMongodb(shopId),
    });

    if (foundDiscount && foundDiscount.discount_isActive) {
      throw new Error("Mã giảm giá đã tồn tại và đang hoạt động.");
    }

    if (
      discount_type === "percentage" &&
      (discount_value < 0 || discount_value > 100)
    ) {
      throw new Error("Giảm giá phần trăm phải nằm trong khoảng từ 0 đến 100.");
    }

    if (discount_type === "fixed_amount" && discount_value < 0) {
      throw new Error("Giảm giá cố định không thể nhỏ hơn 0.");
    }

    const newDiscount = await DiscountModel.create({
      discount_name,
      discount_description,
      discount_type,
      discount_value,
      discount_code,
      discount_startDate,
      discount_endDate,
      discount_max_uses,
      discount_uses_count: 0,
      discount_users_used: [],
      discount_max_user_per,
      discount_min_order_value,
      discount_shopId: convertToObjectIdMongodb(shopId),
      discount_isActive: true,
      discount_applies_to,
      discount_product_ids:
        discount_applies_to === "all" ? [] : discount_product_ids,
    });

    return newDiscount;
  }

  static async getDiscountCodeWithProduct({ code, shopId, limit, page }) {
    console.log(code, shopId, limit, page);
    const foundDiscount = await checkDiscountExists(DiscountModel, {
      discount_code: code,
      discount_shopId: convertToObjectIdMongodb(shopId),
    });

    if (!foundDiscount) {
      throw new Error("Mã giảm giá không tồn tại.");
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount;
    let products = [];

    if (discount_applies_to === "all") {
      products = await findAllProduct({
        filter: {
          product_shop: convertToObjectIdMongodb(shopId),
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    } else if (discount_applies_to === "specific_products") {
      if (!discount_product_ids.length) {
        throw new Error("Mã giảm giá không có sản phẩm cụ thể để áp dụng.");
      }

      products = await findAllProduct({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }

    return products;
  }

  static async getAllDiscountCodesByShop({ limit, page, shopId }) {
    const discountList = await getAllDiscountCodeByShop({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: convertToObjectIdMongodb(shopId),
      },
      unselect: ["__v"],
      model: DiscountModel,
    });
    return discountList;
  }

  static async getDiscountAmount({ codeId, shopId, products }) {
    const foundDiscount = await checkDiscountExists(DiscountModel, {
      discount_code: codeId,
      discount_shopId: convertToObjectIdMongodb(shopId),
    });

    if (!foundDiscount) {
      throw new Error("Mã giảm giá không tồn tại.");
    }

    const {
      discount_isActive,
      discount_max_uses,
      discount_startDate,
      discount_endDate,
      discount_type,
      discount_value,
      discount_min_order_value,
      discount_users_used,
      discount_max_user_per,
    } = foundDiscount;

    if (!discount_isActive) {
      throw new Error("Mã giảm giá không hoạt động.");
    }

    if (discount_max_uses <= 0) {
      throw new Error("Mã giảm giá đã hết lượt sử dụng.");
    }

    if (!products || !products.length) {
      throw new Error("Không có sản phẩm nào trong đơn hàng.");
    }

    const totalOrder = products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
    if (totalOrder < discount_min_order_value) {
      throw new Error(
        `Giảm giá yêu cầu giá trị đơn hàng tối thiểu là ${discount_min_order_value}.`
      );
    }

    const discountAmount =
      discount_type === "fixed_amount"
        ? discount_value
        : totalOrder * (discount_value / 100);

    return {
      totalOrder: totalOrder,
      discountAmount: discountAmount,
      totalPrice: totalOrder - discountAmount,
    };
  }

  static async deleteDiscountCode({ shopId, codeId }) {
    const deleted = await DiscountModel.findOneAndDelete({
      discount_shopId: convertToObjectIdMongodb(shopId),
      discount_code: codeId,
    });
    return deleted;
  }

  static async cancleDiscountCode({ shopId, codeId, userId }) {
    console.log(shopId, codeId, userId);
    const foundDiscount = await checkDiscountExists(DiscountModel, {
      discount_code: codeId,
      discount_shopId: convertToObjectIdMongodb(shopId),
    });

    if (!foundDiscount) {
      throw new Error("Mã giảm giá không tồn tại.");
    }

    const result = await DiscountModel.findByIdAndUpdate(foundDiscount._id, {
      $pull: { discount_users_used: { userId } },
      $inc: { discount_max_uses: 1, discount_uses_count: -1 },
    });

    return result;
  }
}

module.exports = DiscountService;
