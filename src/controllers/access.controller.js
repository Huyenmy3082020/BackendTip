"use strict";
const AccessService = require("../services/access.service");
const { OK, CREATED, Susscess } = require("../core/error.response");

class AccController {
  signUp = async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      return res
        .status(200)
        .json(await AccessService.signUp(name, email, password));
    } catch (error) {
      next(error);
    }
  };

  signIn = async (req, res, next) => {
    try {
      return res.status(200).json(await AccessService.login(req.body));
    } catch (error) {
      next(error);
    }
  };

  logout = async (req, res, next) => {
    try {
      const keyStore = req.keyStore;
      return res.status(200).json(await AccessService.logout(keyStore));
    } catch (error) {
      next(error); // Gửi lỗi tới middleware xử lý lỗi
    }
  };

  refreshToken = async (req, res, next) => {
    try {
      const refreshToken = req.headers["authorization"]?.split(" ")[1];

      console.log("refreshToken", refreshToken);
      if (!refreshToken) {
        throw new Error("Refresh token is required");
      }

      return res
        .status(200)
        .json(await AccessService.handleRefreshToken(refreshToken));
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new AccController();
