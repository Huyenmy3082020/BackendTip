"use strict";

const {
  PutObjectCommand,
  GetObjectAclCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const cloudinary = require("../configs/cloudinary.config");
const fs = require("fs");
const path = require("path");
const { s3 } = require("../configs/s3.config");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
// uploap file S3
const urlImagePublic = "https://d3idhfxlk8o70m.cloudfront.net";

const uploadImageFromAmazonS3 = async ({ filePath }) => {
  try {
    // Đọc file từ đường dẫn
    const fileStream = fs.createReadStream(filePath);
    const fileName = path.basename(filePath);

    const command = new PutObjectCommand({
      Bucket: "shop-bucket-s3",
      Key: `uploads/${fileName}`,
      Body: fileStream,
      ContentType: "image/jpeg",
    });

    const result = await s3.send(command);

    // cap quyen truy cap cho moi nguoi
    const signedUrl = new GetObjectCommand({
      Bucket: "shop-bucket-s3",
      Key: `uploads/${fileName}`,
    });
    const url = await getSignedUrl(s3, signedUrl, command, {
      expiresIn: 3600,
    });
    console.log("Image uploaded successfully:", url);

    return { result, url: `${urlImagePublic}/uploads/${fileName}` };
  } catch (err) {
    console.error("Lỗi upload S3:", err);
    throw err;
  }
};

//End file S3

// upload
const uploadImageUrl = async () => {
  try {
    const urlImage =
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lqwve79ts6h0ba_tn.webp";
    const folderName = "product/shopId",
      newFileName = "test";
    const result = await cloudinary.uploader.upload(urlImage, {
      public_id: newFileName,
      folder: folderName,
      overwrite: true,
      resource_type: "auto",
    });
    console.log("Image uploaded successfully:", result);
  } catch (err) {}
};

const uploadImageFromLocal = async ({ filePath, folderName = "hatuan" }) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: "thumb",
      folder: folderName,
    });
    return {
      image_url: result.secure_url,
      shop_id: 1562004,
    };
  } catch (err) {}
};

module.exports = {
  uploadImageUrl,
  uploadImageFromLocal,
  uploadImageFromAmazonS3,
};
