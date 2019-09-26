const RabbitMQClient = require('../helpers/RabbitMQClient');
const rabbitMQ = new RabbitMQClient({
  connection: {
    hostname: process.env.RABBITMQ_HOST,
    port: process.env.RABBITMQ_PORT,
    protocol: process.env.RABBITMQ_PROTOCOL,
    username: process.env.RABBITMQ_USER,
    password: process.env.RABBITMQ_PASSWORD
  }
});

const init = async () => {
  await rabbitMQ.openConnection();

  await rabbitMQ.createChannel('consumer', {
    queueName: 'messages',
    reconnectOptions: {
      reconnect: true,
      delay: 5000
    }
  });
};

const getRabbitMQConnection = () => {
  return rabbitMQ;
};

module.exports = {
  init,
  getRabbitMQConnection
};
