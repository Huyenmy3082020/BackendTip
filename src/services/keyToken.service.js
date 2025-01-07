// File: services/keyTokenService.js
"use strict";

const { Types } = require("mongoose");
const keytokenModel = require("../models/keytoken.model");

const createKeyToken = async ({
  userId,
  publicKey,
  refreshToken,
  privateKey,
}) => {
  try {
    const filter = { shop: userId };
    const update = {
      publicKey: publicKey,
      refreshToken: refreshToken,
      privateKey: privateKey,
      refreshTokenSecret: [],
    };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    const tokens = await keytokenModel.findOneAndUpdate(
      filter,
      update,
      options
    );
    return tokens ? tokens.publicKey : null;
  } catch (err) {
    console.error("Error saving key token:", err.message);
    throw new Error(`Error saving key token: ${err.message}`);
  }
};

const findByUserID = async (userId) => {
  return await keytokenModel
    .findOne({ shop: new Types.ObjectId(userId) })
    .lean();
};

const deleteKeyToken = async (userId) => {
  return await keytokenModel.deleteOne({ shop: new Types.ObjectId(userId) });
};
const findrefreshTokenUsed = async (refreshToken) => {
  return await keytokenModel.findOne({ refreshTokenUsed: refreshToken });
};
const deleteKeyById = async (userId) => {
  return await keytokenModel.deleteOne({ shop: new Types.ObjectId(userId) });
};

const findByRefreshToken = async (refreshToken) => {
  return await keytokenModel.findOne({ refreshToken });
};
const findByPrivateKey = async (id) => {
  return await keytokenModel.findOne({ shop: new Types.ObjectId(id) });
};
const updateRefreshTokenUsed = async (userId, refreshToken) => {
  try {
    await KeyTokenModel.updateOne(
      { shop: userId },
      { $push: { refreshTokenUsed: refreshToken } }
    );
  } catch (error) {
    console.error("Error updating refreshTokenUsed:", error.message);
    throw new Error("Error updating refreshTokenUsed");
  }
};

const updateRefreshToken = async (userId, newRefreshToken) => {
  try {
    await KeyTokenModel.updateOne(
      { shop: userId },
      { $set: { refreshToken: newRefreshToken } }
    );
  } catch (error) {
    console.error("Error updating refreshToken:", error.message);
    throw new Error("Error updating refreshToken");
  }
};
module.exports = {
  createKeyToken,
  findByUserID,
  deleteKeyToken,
  findrefreshTokenUsed,
  deleteKeyById,
  findByRefreshToken,
  findByPrivateKey,
  updateRefreshTokenUsed,
  updateRefreshToken,
};
