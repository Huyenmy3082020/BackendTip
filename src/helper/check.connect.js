"use strict";

const mongoose = require("mongoose");
const os = require("os");
const process = require("process");

const _SECONDS = 5000;
const countConnect = () => {
  const numConnections = mongoose.connections.length;
};

const checkOverLoadConnect = () => {
  setInterval(() => {
    const numConnections = mongoose.connections.length;
    const numCore = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    const maxConnections = numCore * 3;

    if (numConnections > maxConnections) {
      console.log("Overload connections");
      process.exit(1);
    }
  }, _SECONDS); // monitoring interval
};
module.exports = {
  countConnect,
  checkOverLoadConnect,
};
