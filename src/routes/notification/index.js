const express = require("express");
const router = express.Router();
const Noticontroller = require("../../controllers/notification.controller");
const { asyncHandler } = require("../../helper/asyncHandler");

// chua login
const { authenticateToken } = require("../../auth/authUtils");

// da login
router.use(authenticateToken);
router.get("/", asyncHandler(Noticontroller.listNotiByUser));
router.post("/", asyncHandler(Noticontroller.createNotification));

module.exports = router;
