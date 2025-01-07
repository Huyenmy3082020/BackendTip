"use strict";

const express = require("express");
const { apiKey, checkPermision } = require("../auth/checkAuth");
const router = express.Router();

// check Api key

router.use("/v1/api/product", require("./product"));
router.use(apiKey);
router.use(checkPermision("0000"));
router.use("/v1/api", require("./access"));
router.use("/v1/api/discount", require("./discount"));
router.use("/v1/api/cart", require("./cart"));
router.use("/v1/api/checkout", require("./checkout"));
router.use("/v1/api/inventory", require("./inventory"));

module.exports = router;
