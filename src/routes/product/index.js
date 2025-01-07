const express = require("express");
const router = express.Router();
const ProductController = require("../../controllers/product.controller");
const { asyncHandler } = require("../../helper/asyncHandler");

const { authenticateToken } = require("../../auth/authUtils");

router.get(
  "/search/:keySearch",
  asyncHandler(ProductController.getListSearchProduct)
);

router.get("/getAllProduct", asyncHandler(ProductController.getAllProducts));

router.get("/product/:id", asyncHandler(ProductController.findByid));
router.use(authenticateToken);
router.post("/", authenticateToken, ProductController.createProduct1);
router.patch("/:productId", authenticateToken, ProductController.updateProduct);
router.post(
  "/publish/:id",
  authenticateToken,
  asyncHandler(ProductController.publicProductByShop)
);

router.post(
  "/publish/:id",
  authenticateToken,
  asyncHandler(ProductController.getUnPublishProducts)
);
router.get("/getAll", asyncHandler(ProductController.getAllProducts));
router.get(
  "/publish/all",
  asyncHandler(ProductController.getAllPublishProducts)
);
router.get("/draft/all", asyncHandler(ProductController.getAllDraftProducts));

module.exports = router;
