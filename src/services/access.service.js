// File: services/accessService.js
"use strict";

const ShopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { createTokenPair, verifyJMTToken } = require("../auth/authUtils");
const KeyTokenService = require("../services/keyToken.service");
const getInforData = require("../utils");
const { ConflictRequestError } = require("../core/error.response");
const { findByEmail } = require("./shop.service");
const accessController = require("../controllers/access.controller");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static handleRefreshToken = async (refreshToken) => {
    const foundToken = await KeyTokenService.findrefreshTokenUsed(refreshToken);
    if (foundToken) {
      const { userId, email } = await verifyJMTToken(
        refreshToken,
        foundToken.publicKey
      );
      await KeyTokenService.deleteKeyById(userId);
    }
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    if (!holderToken) {
      throw new Error("Refresh token is invalid");
    }

    const { userId, email } = await verifyJMTToken(
      refreshToken,
      holderToken.publicKey
    );
    const foundShop = await findByEmail(email);
    if (!foundShop) {
      throw new Error("User not found");
    }

    const tokens = await createTokenPair(
      { userId: foundShop._id, email },
      holderToken.privateKey
    );

    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokenUsed: refreshToken,
      },
    });
    return {
      user: {
        userId: foundShop._id,
        email,
      },
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
    };
  };
  static signUp = async (name, email, password) => {
    try {
      const existingShop = await ShopModel.findOne({ email }).lean();
      if (existingShop) {
        throw new ConflictRequestError("Email already exists");
      }
      const passwordHash = await bcrypt.hash(password, 10);

      // Create new shop
      const newShop = await ShopModel.create({
        name,
        email,
        password: passwordHash,
        roles: [RoleShop.SHOP],
      });

      if (!newShop) {
        return {
          code: "500",
          message: "Failed to create shop",
        };
      }

      // Generate RSA key pair
      const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: {
          type: "spki",
          format: "pem",
        },
        privateKeyEncoding: {
          type: "pkcs8",
          format: "pem",
        },
      });

      const keyToken = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!keyToken) {
        return {
          code: "500",
          message: "Failed to save public key",
        };
      }

      return {
        code: "200",
        message: "Sign up success",
      };
    } catch (error) {
      console.error("Error in signUp:", error);
      return {
        code: "500",
        message: error.message || "Internal Server Error",
      };
    }
  };

  static login = async ({ email, password, refresh_token = null }) => {
    const foundShop = await findByEmail(email);
    if (!foundShop) {
      throw new ConflictRequestError("Email not found");
    }
    const isMatch = await bcrypt.compare(password, foundShop.password);
    if (!isMatch) {
      throw new ConflictRequestError("Password incorrect");
    }

    const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
    });
    const tokens = await createTokenPair(
      { userId: foundShop._id, email },
      privateKey
    );

    await KeyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      userId: foundShop._id,
      publicKey,
      privateKey,
    });
    return {
      metadata: {
        shop: foundShop,
        tokens,
      },
    };
  };
  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.deleteKeyToken(keyStore._id);
    console.log(delKey);
    return {
      code: "200",
      message: "Logout success",
    };
  };
}

module.exports = AccessService;
