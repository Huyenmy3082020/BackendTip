const express = require("express");
const router = express.Router();
const CommentController = require("../../controllers/comment.controller");
const { asyncHandler } = require("../../helper/asyncHandler");
const { authenticateToken } = require("../../auth/authUtils");

router.use(authenticateToken);
router.post("/", asyncHandler(CommentController.createComment));
router.get("/get", asyncHandler(CommentController.getComent));
router.delete("/del", asyncHandler(CommentController.deleteComment));

module.exports = router;
