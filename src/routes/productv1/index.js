const express = require("express");
const router = express.Router();
const ProductController = require("../../controllers/productv1.controller");
const { asyncHandler } = require("../../helper/asyncHandler");

const { authenticateToken } = require("../../auth/authUtils");

router.use(authenticateToken);
router.post("/", authenticateToken, ProductController.createProduct1);

module.exports = router;
