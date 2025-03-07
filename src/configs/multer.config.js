"use strict";
const multer = require("multer");

// Lưu file vào bộ nhớ RAM
const uploadMemory = multer({
  storage: multer.memoryStorage(),
});

// Lưu file vào ổ cứng
const uploadDisk = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./src/uploads");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  }),
});

module.exports = {
  uploadMemory,
  uploadDisk,
};
