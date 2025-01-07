"use strict";

const JWT = require("jsonwebtoken");
const { asyncHandler } = require("../helper/asyncHandler");
const { findByUserID } = require("../services/keyToken.service");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
  Client: "client",
  REFRESHTOKEN: "refreshToken",
};

const createTokenPair = async (payload, privateKey) => {
  try {
    const accessToken = JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "2d",
    });

    const refreshToken = JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "7d",
    });

    return { accessToken, refreshToken };
  } catch (err) {
    console.error("Error creating token pair:", err.message);
    throw new Error(`Error creating token pair: ${err.message}`);
  }
};

const authenticateToken = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.Client];

  if (!userId) {
    throw new Error("Client ID is required for authentication");
  }
  const keyStore = await findByUserID(userId);
  if (!keyStore) {
    throw new Error("Client ID is invalid");
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION];

  console.log("accessToken", accessToken);
  if (!accessToken) {
    throw new Error("Access token is required for authentication");
  }

  try {
    const decoded = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decoded.userId) {
      throw new Error("Access token is invalid");
    }
    console.log("decoded", decoded);
    req.keyStore = keyStore;
    req.user = decoded;
    return next();
  } catch (e) {
    console.error("Token verification failed:", e.message);
    throw new Error("Access token is invalid");
  }
});

const verifyJMTToken = async (token, keySecret) => {
  return await JWT.verify(token, keySecret);
};

module.exports = {
  createTokenPair,
  authenticateToken,
  verifyJMTToken,
};
