"use strict";
const { createClient } = require("redis");
const { reservationInventory } = require("../models/repository/inventory.repo");

// Khởi tạo Redis client
const redisClient = createClient({
  url: "redis://localhost:6379", // Thay đổi URL nếu Redis không chạy ở localhost
});

// Xử lý lỗi kết nối Redis
redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

// Kết nối Redis
(async () => {
  try {
    await redisClient.connect();
    console.log("Connected to Redis successfully");
  } catch (err) {
    console.error("Could not connect to Redis:", err);
  }
})();
const acquireLock = async (productId, quantity, cartId) => {
  console.log(productId, quantity, cartId);
  const key = `lock_v2025_${productId}`;
  const retryTime = 20; // Tăng số lần thử
  const expireTime = 3000; // Thời gian hết hạn của khóa (tính bằng miligiây)

  for (let index = 0; index < retryTime; index++) {
    try {
      const result = await redisClient.setNX(key, "1");
      if (result) {
        console.log("Khóa đã được cấp cho sản phẩm:", productId);
        const isReservation = await reservationInventory({
          productId,
          quantity,
          cartId,
        });
        console.log("Reservation result:", isReservation);
        if (isReservation.modifiedCount) {
          await redisClient.pExpire(key, expireTime);
          return key;
        }
      } else {
        console.log("Đang thử lại để cấp khóa...");
        await new Promise((resolve) => setTimeout(resolve, 500)); // Giảm thời gian chờ
      }
    } catch (err) {
      console.error("Error in acquireLock:", err);
    }
  }

  throw new Error("Không thể cấp khóa sau khi thử đủ số lần.");
};

// Hàm releaseLock
const releaseLock = async (keyLock) => {
  try {
    const result = await redisClient.del(keyLock); // Giải phóng khóa
    console.log(`Khóa ${keyLock} đã được giải phóng`);
    return result;
  } catch (err) {
    console.error("Error in releaseLock:", err);
  }
};

module.exports = { acquireLock, releaseLock };
