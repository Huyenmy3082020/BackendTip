const redisPubSubService = require("../src/services/redisPubSub.service");

class ProductServiceTest {
  purchaseProduct(productId, quantity) {
    const order = {
      productId,
      quantity,
    };
    redisPubSubService.publish("purchase_event", Json.stringify(order));
  }
}

module.exports = ProductServiceTest;
