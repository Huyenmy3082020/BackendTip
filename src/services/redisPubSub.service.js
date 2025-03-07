const Redis = require("redis");

class RedisPubSubService {
  constructor() {
    this.subcribe = Redis.createClient();
    this.publish = Redis.createClient();
  }
  publish(channel, message) {
    return new Promise((resolve, reject) => {
      this.publish(channel, message, (err, reply) => {
        if (err) reject(err);
        resolve(reply);
      });
    });
  }
  subscribe(channel, callback) {
    this.subcribe.subscribe(channel);
    this.subcribe.on("message", (subcribeChannel, message) => {
      if (channel === subcribeChannel) {
        callback(subcribeChannel);
      }
    });
  }
}
module.exports = new RedisPubSubService();
