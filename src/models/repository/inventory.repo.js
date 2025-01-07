const { convertToObjectIdMongodb } = require("../../utils");
const { inventory } = require("../inventory.model");
const { Types } = require("mongoose");
const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = "unknown",
}) => {
  return await inventory.create({
    productId: Types.ObjectId(productId),
    shopId: Types.ObjectId(shopId),
    stock,
    location,
  });
};
const reservationInventory = async ({ productId, quantity, cartId }) => {
  const query = {
      inven_productId: convertToObjectIdMongodb(productId),
      inven_stock: { $gte: quantity },
    },
    updateSet = {
      $inc: { inven_stock: -quantity },
      $push: {
        inven_reservations: {
          quantity,
          cartId,
          createOn: new Date(),
        },
      },
      options: {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    };
  return await inventory.updateOne(query, updateSet);
};
module.exports = {
  insertInventory,
  reservationInventory,
};
