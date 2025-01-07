"use strict";
const redis = require("redis");
const { promisify } = require("util");
const { reservationInventory } = require("../models/repository/inventory.repo");
const redisClient = redis.createClient(); // Khởi tạo client Redis
const pexpireAsync = promisify(redisClient.pexpire).bind(redisClient);
// nếu nó không tồn tại
const setnxAsync = promisify(redisClient.setnx).bind(redisClient);

const acquireLock = async (productId, quantity, cartId) => {
  const key = "lock_v2025_" + productId;
  const retryTime = 10; // Số lần thử
  const expireTime = 3000; // Thời gian hết hạn của khóa (tính bằng miligiây)

  for (let index = 0; index < retryTime; index++) {
    // Sửa lại vòng lặp
    // tạo 1 key , ai năm giữ được vào thanh toán

    const result = await setnxAsync(key, 1); // Thử thiết lập khóa nếu chưa có

    console.log(result);
    z;
    if (result === 1) {
      // Nếu khóa được thiết lập thành công, gán thời gian hết hạn
      const isReversation = await reservationInventory({
        productId,
        quantity,
        cartId,
      });
      if (isReversation.modifiedCount) {
        await pexpire(key, expireTime);
        return key;
      }
      console.log("Khóa đã được cấp cho sản phẩm:", productId);
      return key; // Trả về khóa
    } else {
      console.log("Đang thử lại để cấp khóa...");
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Chờ 1 giây trước khi thử lại
    }
  }

  throw new Error("Không thể cấp khóa sau khi thử đủ số lần.");
};

const releaseLock = async (keyLock) => {
  const delAsync = promisify(redisClient.del).bind(redisClient);
  return await delAsync(keyLock); // Giải phóng khóa
};

module.exports = { acquireLock, releaseLock };
