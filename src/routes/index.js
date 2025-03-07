"use strict";

const express = require("express");
const { apiKey, checkPermision } = require("../auth/checkAuth");
const router = express.Router();

// check Api key

router.use("/v1/api/upload", require("./upload"));
router.use("/v1/api/product", require("./product"));
router.use("/v1/api/productv1", require("./productv1"));
// router.use(apiKey);
// router.use(checkPermision("0000"));
router.use("/v1/api", require("./access"));
router.use("/v1/api/discount", require("./discount"));
router.use("/v1/api/cart", require("./cart"));
router.use("/v1/api/checkout", require("./checkout"));
router.use("/v1/api/inventory", require("./inventory"));
router.use("/v1/api/comment", require("./comment"));
router.use("/v1/api/notification", require("./notification"));

module.exports = router;
