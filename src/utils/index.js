"use strict";

const _ = require("lodash");
const { Types } = require("mongoose");
const convertToObjectIdMongodb = (id) => new Types.ObjectId(id);
const getInforData = ({ filed = [], object = {} }) => {
  return _.pick(object, filed);
};

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};
const ungetSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};
const removeUndefinedObject = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === null) {
      delete obj[key];
    }
  });
  return obj;
};
const updateNestedObject = (obj) => {
  const final = {};
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      const response = updateNestedObject(obj[key]);

      Object.keys(obj[key]).forEach((key2) => {
        final[`${key}.${key2}`] = response[key2];
      });
    } else {
      final[key] = obj[key];
    }
  });
  return final;
};
module.exports = {
  getInforData,
  getSelectData,
  ungetSelectData,
  removeUndefinedObject,
  updateNestedObject,
  convertToObjectIdMongodb,
};
