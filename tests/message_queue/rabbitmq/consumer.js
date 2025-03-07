const amqp = require("amqplib");

const QUEUE_NAME = "test_topic"; // Tên hàng đợi

const runConsumer = async () => {
  try {
    // Kết nối tới RabbitMQ
    const connection = await amqp.connect("amqp://localhost");

    const channel = await connection.createChannel();

    // Đảm bảo queue tồn tại
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    console.log(
      `[*] Waiting for messages in queue: ${QUEUE_NAME}. To exit, press CTRL+C`
    );

    // Nhận tin nhắn
    channel.consume(
      QUEUE_NAME,
      (message) => {
        if (message !== null) {
          console.log(`[x] Received: ${message.content.toString()}`);
        }
      },
      { noAck: true }
    );
  } catch (error) {
    console.error("Error in Consumer:", error);
  }
};

// Chạy consumer
runConsumer();
