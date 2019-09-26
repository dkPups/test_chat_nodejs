const redis = require('redis');
const bluebird = require('bluebird');
const pgPromise = require('pg-promise')({ promiseLib: bluebird });
const RabbitMQClient = require('../helpers/RabbitMQClient');
const connections = {
  redis: null,
  db: null,
  rabbit: null
};

const init = async () => {
  if (!connections.redis) {
    await new Promise((resolve, reject) => {
      connections.redis = redis.createClient({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
      });

      const errorHandler = err => reject(err);
      const successHandler = () => {
        console.log('[INIT] Connected to redis successfully');
        connections.redis.off('error', errorHandler);
        resolve();
      };

      connections.redis.once('error', errorHandler);

      connections.redis.once('ready', successHandler);
    });
  }

  if (!connections.rabbit) {
    connections.rabbit = new RabbitMQClient({
      connection: {
        hostname: process.env.RABBITMQ_HOST,
        port: process.env.RABBITMQ_PORT,
        protocol: process.env.RABBITMQ_PROTOCOL,
        username: process.env.RABBITMQ_USER,
        password: process.env.RABBITMQ_PASSWORD
      }
    });

    await connections.rabbit.openConnection();

    await connections.rabbit.createChannel('producer', {
      queueName: 'messages',
      reconnectOptions: {
        reconnect: true,
        delay: 5000
      }
    });
  }

  if (!connections.db) {
    connections.db = pgPromise({
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT,
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD
    });

    const version = await connections.db.proc('version');
    console.log(
      `[INIT] Connected to postgresql (${version.version}) successfully`
    );
  }

  return connections;
};

const getRedisConnection = () => {
  return connections.redis;
};

const getDatabaseConnection = () => {
  return connections.db;
};

const getRabbitMQConnection = () => {
  return connections.rabbit;
};

module.exports = {
  init,
  getRedisConnection,
  getDatabaseConnection,
  getRabbitMQConnection
};
