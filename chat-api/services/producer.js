const rabbitMQConnection = require('../services/connection').getRabbitMQConnection();

const sendToQueue = (data, isPersistent) =>
  new Promise(resolve => {
    rabbitMQConnection.channels['producer'].channel.sendToQueue(
      'messages',
      Buffer.from(data),
      {
        persistent: isPersistent
      },
      err => {
        if (err) {
          resolve(err);
        } else {
          resolve();
        }
      }
    );
  });

module.exports = sendToQueue;
