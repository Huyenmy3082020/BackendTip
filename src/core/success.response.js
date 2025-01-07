"use strict";

const StatusCode = {
  OK: 200,
  CREATED: 201,
};

const ReasonStatusCode = {
  OK: "OK",
  CREATED: "Created",
};

class SuccessResponse {
  constructor(
    message,
    statusCode = StatusCode.OK,
    reasonStatusCode = ReasonStatusCode.OK, // Thay đổi biến này
    metaData = {}
  ) {
    this.message = message;
    this.statusCode = statusCode;
    this.reasonStatusCode = reasonStatusCode; // Sửa lại đây
    this.metaData = metaData;
  }

  send(res, headers = {}) {
    return res.status(this.statusCode).json(this);
  }
}

class OK extends SuccessResponse {
  constructor({ message, metaData }) {
    super(message, StatusCode.OK, ReasonStatusCode.OK, metaData);
  }
}

class CREATED extends SuccessResponse {
  constructor({ message, metaData }) {
    super(message, StatusCode.CREATED, ReasonStatusCode.CREATED, metaData);
  }
}

module.exports = {
  OK,
  CREATED,
};
