const { convertToObjectIdMongodb } = require("../../utils");
const invent = require("../inventory.model");
const { Types } = require("mongoose");
const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = "unknown",
}) => {
  return await invent.create({
    productId: Types.ObjectId(productId),
    shopId: Types.ObjectId(shopId),
    stock,
    location,
  });
};
const reservationInventory = async ({ productId, quantity, cartId }) => {
  const query = {
    inven_productId: productId,
    inven_stock: { $gte: quantity },
  };

  const updateSet = {
    $inc: { inven_stock: -quantity },
    $push: {
      inven_reservations: {
        quantity,
        cartId,
        createOn: new Date(),
      },
    },
  };

  const options = {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  };

  // Truyền options riêng biệt khi gọi updateOne
  return await invent.updateOne(query, updateSet, options);
};

module.exports = {
  insertInventory,
  reservationInventory,
};
