const express = require("express");
const router = express.Router();
const AccController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../helper/asyncHandler");

const { authenticateToken } = require("../../auth/authUtils");

// Apply authenticateToken middleware only to the logout route
router.post("/shop/sign-up", asyncHandler(AccController.signUp));
router.post("/shop/login", asyncHandler(AccController.signIn));
router.post("/shop/refreshToken", asyncHandler(AccController.refreshToken));
router.post(
  "/shop/logout",
  authenticateToken,
  asyncHandler(AccController.logout)
);

module.exports = router;
