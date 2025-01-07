const express = require("express");
const router = express.Router();
const DiscountController = require("../../controllers/discount.controller");
const { asyncHandler } = require("../../helper/asyncHandler");

router.get(
  "/list_product_code",
  asyncHandler(DiscountController.getAllDiscountCodeWidthProduct)
);
router.get(
  "/getAllProductCode",
  asyncHandler(DiscountController.getAllDiscountCodesByShop)
);
router.post("/amount", asyncHandler(DiscountController.getDiscountAmount));
const { authenticateToken } = require("../../auth/authUtils");
router.use(authenticateToken);
router.post("/", asyncHandler(DiscountController.createDiscountCode));
router.post(
  "/cancle",
  asyncHandler(DiscountController.cancleDiscountCodeWidthProduct)
);
// router.get("/", asyncHandler(DiscountController.getAllDiscountCodeWidth
module.exports = router;
