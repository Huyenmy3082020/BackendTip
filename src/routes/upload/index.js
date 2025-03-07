const express = require("express");
const router = express.Router();
const UploadController = require("../../controllers/upload.controller");
const { uploadDisk } = require("../../configs/multer.config");

router.post("/upload", UploadController.uploadImage);
router.post(
  "/product_thumb",
  uploadDisk.single("file"),
  UploadController.uploadThumbnail
);
router.post("/s3", uploadDisk.single("file"), UploadController.uploadFileS3);
module.exports = router;
