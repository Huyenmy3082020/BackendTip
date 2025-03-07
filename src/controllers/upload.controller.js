"use strict";
const uploadImageUrl = require("../services/upload.service");

class UploadController {
  uploadImage = async (req, res) => {
    try {
      await uploadImageUrl();
      res.status(200).json({ message: "Upload thành công" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  };

  uploadThumbnail = async (req, res) => {
    try {
      const { file } = req;

      if (!file) {
        return res.status(400).json({ message: "Không tìm thấy file upload" });
      }

      if (!file.path) {
        return res.status(500).json({ message: "Lỗi lưu file trên server" });
      }

      const result = await uploadImageUrl.uploadImageFromLocal({
        filePath: file.path,
      });

      res.status(200).json({
        message: "Upload thành công",
        filePath: file.path,
        imageUrl: result.image_url,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  };
  uploadFileS3 = async (req, res) => {
    try {
      const { file } = req;

      if (!file) {
        return res.status(400).json({ message: "Không tìm thấy file upload" });
      }

      if (!file.path) {
        return res.status(500).json({ message: "Lỗi lưu file trên server" });
      }

      const result = await uploadImageUrl.uploadImageFromAmazonS3({
        filePath: file.path,
      });

      res.status(200).json({
        result: result,
      });
    } catch (error) {
      console.error("Lỗi upload:", error);
      res.status(500).json({ message: "Server Error" });
    }
  };
}

module.exports = new UploadController();
