const amqp = require('amqplib');
const EventEmitter = require('events').EventEmitter;
const { isEmpty } = require('lodash');

class RabbitMQ extends EventEmitter {
  constructor(options = {}) {
    super();
    // 0 - not init, 1 - connecting, 2 - connected, 3 - disconnected
    this.conn = {
      options: options.connection || {},
      connection: null,
      status: 0,
      reconnectInterval: null
    };
    this.channels = {};
  }

  async openConnection() {
    try {
      if ([1, 2].includes(this.conn.status)) {
        return;
      }
      this.conn.status = 1;
      this.conn.connection = await amqp.connect(this.conn.options);
      this.conn.status = 2;

      if (this.conn.reconnectInterval) {
        clearInterval(this.conn.reconnectInterval);
        this.conn.reconnectInterval = null;
      }

      this.conn.connection.on('close', () => {
        console.error(`[RABBIT_MQ][CONNECTION] CLOSED`);

        this.conn.status = 3;

        this.conn.reconnectInterval = setInterval(() => {
          this.openConnection()
            .then(() => {
              if (this.conn.status === 2) {
                console.log('[RABBITMQ][RECONNECT][SUCCESS]');
              }
            })
            .catch(err => {
              console.error('[RABBITMQ][RECONNECT]: ', err.message);
            });
        }, 5000);
      });

      this.conn.connection.on('error', () => {
        console.error(`[RABBIT_MQ][CONNECTION] ERROR`);
      });
    } catch (err) {
      this.conn.status = 3;
      throw err;
    }
  }

  async createChannel(name, options = {}) {
    try {
      const isExistChannel =
        this.channels[name] && [1, 2].includes(this.channels[name].status);

      if (isExistChannel) {
        return;
      }

      if (!this.channels[name]) {
        this.channels[name] = {
          channel: null,
          options: options || {},
          reconnectInterval: null,
          status: 0
        };
      }

      if (this.conn.status !== 2) {
        throw new Error('Not found active connection');
      }

      this.channels[name].status = 1;
      this.channels[name].channel = await this.conn.connection.createConfirmChannel();
      this.channels[name].status = 2;

      if (this.channels[name].reconnectInterval) {
        clearInterval(this.channels[name].reconnectInterval);
        this.channels[name].reconnectInterval = null;
      }

      this.channels[name].channel.on('close', () => {
        console.error('[RABBIT_MQ][CHANNEL] CLOSED');

        this.channels[name].status = 3;

        this.channels[name].reconnectInterval = setInterval(() => {
          this.createChannel(name, options)
            .then(() => {
              console.log('[RABBITMQ][RECREATE_CHANNEL][SUCCESS]');
              super.emit('channel:recreated', { channel: name });
            })
            .catch(err => {
              console.error('[RABBITMQ][RECREATE_CHANNEL]: ', err.message);
            });
        }, 5000);
      });

      this.channels[name].channel.on('error', () => {
        console.error('[RABBIT_MQ][CHANNEL] ERROR');
      });

      await this.channels[name].channel.assertQueue(options.queueName);
    } catch (err) {
      this.channels[name].status = 3;
      throw err;
    }
  }
}

module.exports = RabbitMQ;
