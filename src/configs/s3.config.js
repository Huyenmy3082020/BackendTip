"use strict";

const { S3Client, PutObjectCommandt } = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");
const S3Config = {
  region: "ap-southeast-2",
  credentials: {
    accessKeyId: "AKIAZVMTUWWJGZBNYUTA ",
    secretAccessKey: "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",
  },
};

const s3 = new S3Client(S3Config);
module.exports = { s3, PutObjectCommandt };
