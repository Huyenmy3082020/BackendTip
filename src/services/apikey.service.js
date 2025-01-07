"use strict";
const apikeymodel = require("../models/apikey.model");
const crypto = require("crypto");
const findById = async (key) => {
  const object = await apikeymodel
    .findOne({
      key,
      status: "true",
    })
    .lean();
  return object;
};
module.exports = {
  findById,
};
