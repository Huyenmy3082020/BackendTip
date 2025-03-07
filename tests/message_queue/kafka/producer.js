const { Kafka, logLevel } = require("kafkajs");

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"],
  logLevel: logLevel.NOTHING,
});
const producer = kafka.producer();

const runProducer = async () => {
  await producer.connect();
  await producer.send({
    topic: "test-topic", // Đảm bảo topic này trùng với topic của consumer
    messages: [{ value: "Hello, Kafka!" }],
  });
  await producer.disconnect();
};

runProducer().catch(console.error);
