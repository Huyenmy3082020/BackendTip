const { getSelectData } = require("../../utils");
const { ungetSelectData } = require("../../utils");
const getAllDiscountCodeByShop = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  unselect,
  model,
}) => {
  const skip = (page - 1) * limit;
  const shortBy = sort === "ctime" ? { _id: -1 } : { _id: -1 };

  const products = await model
    .find(filter)
    .sort(shortBy)
    .limit(limit)
    .skip(skip)
    .select(ungetSelectData(unselect)) // Gọi select trước lean()
    .lean()
    .exec();

  return products;
};

const findAllDiscountCodeSelect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  select,
  model,
}) => {
  const skip = (page - 1) * limit;
  const shortBy = sort === "ctime" ? { _id: -1 } : { _id: -1 };
  const products = await model
    .find(filter)
    .sort(shortBy)
    .limit(limit)
    .skip(skip)
    .lean()
    .exec()
    .select(getSelectData(select));

  return products;
};

const checkDiscountExists = async (model, filter) => {
  if (!model || typeof model.findOne !== "function") {
    throw new Error("Model không hợp lệ hoặc không được truyền vào.");
  }
  console.log("model", model);
  console.log("filter", filter);
  return await model.findOne(filter).lean();
};

module.exports = {
  getAllDiscountCodeByShop,
  findAllDiscountCodeSelect,
  checkDiscountExists,
};
