"use strict";

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};
const { findById } = require("../services/apikey.service");
const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY];

    const objkey = await findById(key);
    if (!objkey) {
      return res.status(403).json({
        message: "API Key is valid",
      });
    }
    req.objkey = objkey;
    return next();
  } catch (err) {
    next(err);
  }
};
const checkPermision = (per) => {
  return (req, res, next) => {
    if (!req.objkey.permission) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }
    const validPermissions = req.objkey.permission.includes(per);
    if (!validPermissions) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }
    return next();
  };
};


module.exports = {
  apiKey,
  checkPermision,
};
