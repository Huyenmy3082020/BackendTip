const { Kafka, logLevel } = require("kafkajs");

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"],
  logLevel: logLevel.NOTHING,
});
const consumer = kafka.consumer({
  groupId: "my-group",
});

const runConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({
    topic: "test-topic", // Đảm bảo topic này trùng với topic của producer
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        topic,
        partition,
        timestamp: message.timestamp,
        key: message.key ? message.key.toString() : null, // Kiểm tra trước khi chuyển đổi
        value: message.value.toString(),
      });
    },
  });
};

runConsumer().catch(console.error);
