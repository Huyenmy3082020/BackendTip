"use strict";
const { notification } = require("../models/notifications.model");
const pushNotiToSystem = async ({
  type = "Shop--001",
  receiverId = 1,
  senderId = 1,
  options = {},
}) => {
  let noti_content;
  if (type === "Shop--001") {
    noti_content = `Vừa thêm được sản phẩm`;
  } else if ((type = "Promotion")) {
    noti_content = "Vua them mot voucher moi ";
  }
  const newNoti = await notification.create({
    noti_type: type,
    noti_sendId: senderId,
    noti_receiveId: receiverId,
    noti_content: noti_content,
    noti_option: options,
  });
  return newNoti;
};

const listNotiByUser = async ({ userId = 1, type = "all", isRead = 0 }) => {
  const match = { noti_receiveId: userId };

  // Thêm điều kiện lọc theo trạng thái đọc
  if (isRead !== undefined) {
    match.isRead = isRead;
  }

  // Thêm điều kiện lọc theo loại thông báo
  if (type !== "all") {
    match.noti_type = type;
  }

  // Truy vấn với điều kiện và lấy giá trị shop_name trong noti_option
  return await notification.aggregate([
    {
      $match: match,
    },
    {
      $project: {
        noti_type: 1,
        noti_sendId: 1,
        noti_receiveId: 1,
        noti_content: 1,
        created_at: 1,
        "noti_option.shop_name": 1, // Lấy trực tiếp trường shop_name
        shop_name: {
          $substrBytes: ["$noti_option.shop_name", 0, 50], // Lấy tối đa 50 ký tự đầu
        },
      },
    },
  ]);
};

module.exports = {
  pushNotiToSystem,
  listNotiByUser,
};
