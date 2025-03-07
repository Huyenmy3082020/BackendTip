const redisPubSubService = require("../src/services/redisPubSub.service");

class InventoryTest {
  constructor() {
    redisPubSubService.subscribe("purchase_events", (channle, message) => {
      InventoryTest.update_inventory(message);
    });
  }
  static update_inventory(productId, quantity) {
    console.log(`Updated inventory for product ${productId}: ${quantity}`);
  }
}

module.exports = new InventoryTest();
