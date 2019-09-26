const rabbitMQConnection = require('../services/connection').getRabbitMQConnection();
const io = require('socket.io')(3000);
const redisAdapter = require('socket.io-redis');
io.adapter(
  redisAdapter({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT })
);

const startConsumeEventsQueue = async () => {
  await rabbitMQConnection.channels['consumer'].channel.consume(
    'messages',
    msg => {
      io.emit('newMessage', JSON.parse(msg.content.toString()));
    },
    { noAck: true }
  );
};

const init = async () => {
  await startConsumeEventsQueue();

  rabbitMQConnection.on('channel:recreated', () => {
    startConsumeEventsQueue()
      .then(() => {
        console.log('[RABBITMQ][RECREATE_CONSUMER][SUCCESS]');
      })
      .catch(err => {
        console.error('[RABBITMQ][RECREATE_CONSUMER]: ', err.message);
      });
  });
};

module.exports = init;
