const express = require("express");
const router = express.Router();
const CheckoutController = require("../../controllers/checkout.controller");
const { asyncHandler } = require("../../helper/asyncHandler");
const { authenticateToken } = require("../../auth/authUtils");

router.use(authenticateToken);

router.post("/", asyncHandler(CheckoutController.checkoutReview));
router.post("/order", asyncHandler(CheckoutController.addOrder));

module.exports = router;
