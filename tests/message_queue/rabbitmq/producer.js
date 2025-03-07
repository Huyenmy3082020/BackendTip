const amqp = require("amqplib");

const QUEUE_NAME = "test_topic"; // Hàng đợi

const runProducer = async () => {
  const orderData = {
    orderId: "ORD12345",
    productName: "Widget",
    quantity: 10,
    stockLeft: 2,
    message: "Stock is running low",
  };

  try {
    // Kết nối tới RabbitMQ
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    // Đảm bảo queue tồn tại
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    // Chuyển dữ liệu sang dạng Buffer và gửi
    const message = JSON.stringify(orderData);
    channel.sendToQueue(QUEUE_NAME, Buffer.from(message), { persistent: true });

    console.log(`[x] Sent: ${message}`);

    // Đóng kết nối
    await channel.close();
    await connection.close();
  } catch (error) {
    console.error("Error in Producer:", error);
  }
};

// Chạy producer
runProducer();
