const express = require("express");
const app = express();
require("dotenv").config();
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const compression = require("compression");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// init middleware
// theo doi cac log ...
app.use(morgan("dev"));
// an toan bao mat...
app.use(helmet());
app.use(express.json());
// nen du lieu...
app.use(compression());

// init db
require("./dbs/init.mongodb");
const { countConnect } = require("./helper/check.connect");
const { checkOverLoadConnect } = require("./helper/check.connect");

// init routes

app.use("/", require("./routes/index"));
// handle error

app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});
app.use((err, req, res, next) => {
  const status = err.status || 500;
  return res.status(status).json({
    error: {
      status: status,
      message: err.message,
      stack: err.stack,
    },
  });
});
module.exports = app;
