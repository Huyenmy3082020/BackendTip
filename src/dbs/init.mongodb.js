"use strict";

const mongoose = require("mongoose");
const { countConnect } = require("../helper/check.connect");

const {
  db: { host, port, name },
} = require("../configs/config.mogodb");
const connectString = `mongodb://${host}:${port}/${name}`;

console.log(connectString);
class Database {
  constructor() {
    this.connect();
  }

  // Connect to MongoDB
  async connect(type = "mongodb") {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }

    mongoose
      .connect(connectString, {
        maxPoolSize: 50,
      })

      .then((_) =>
        console.log(
          `Connected to MongoDB Successfully 
        `,
          countConnect()
        )
      )
      .catch((err) => console.error("Failed to connect to MongoDB", err));
  }
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;
