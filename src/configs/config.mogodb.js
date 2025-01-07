"use strict";

require("dotenv").config(); // Nạp biến môi trường từ .env

// Cấu hình cho môi trường dev và pro
const dev = {
  app: {
    port: process.env.APP_PORT || 8386,
  },
  db: {
    host: process.env.DEV_DB_HOST || "localhost",
    port: process.env.DEV_DB_PORT || 27017,
    name: process.env.DEV_DB_NAME || "dbDev",
  },
};

const pro = {
  app: {
    port: process.env.APP_PORT || 8386,
  },
  db: {
    host: process.env.PRO_DB_HOST || "localhost",
    port: process.env.PRO_DB_PORT || 27017,
    name: process.env.PRO_DB_NAME || "dbProduct",
  },
};

const config = { dev, pro };
const env = process.env.NODE_ENV || "dev"; // Mặc định là 'dev' nếu không có NODE_ENV
module.exports = config[env];
