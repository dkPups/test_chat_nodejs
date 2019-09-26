const InitConnections = require('./services/connection').init;

InitConnections()
  .then(() => {
    const express = require('express');
//  const session = require('express-session');
//  const RedisStore = require('connect-redis')(session)
    const cookieParser = require('cookie-parser');
    const bodyParser = require('body-parser');
//  const redisConnection = require('./services/connection').getRedisConnection();
    const errorMiddleware = require('./middlewares/error');
    const app = express();
    const roomRouter = require('./routes/RoomController');
    const messageRouter = require('./routes/MessageController');

    app.use(cookieParser());
    app.use(bodyParser.json());

    /*
            Так как необходимо будет скейлить сервисы, то подключил redis для хранения сессий уже, так как
            иначе будет хранение идти в памяти каждого инстанса и соответственно при балансировке будут ошибки
            с аутентификацией. Закомментировал данную часть, так как из-за отсутствия авторизации
            проблематично будет тестировать функционал
    */
    // app.use(session({
    //     key: process.env.SESSION_NAME,
    //     secret: process.env.SESSION_SECRET_KEY,
    //     store: new RedisStore({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT, client: redisConnection }),
    //     saveUninitialized: false,
    //     resave: false
    // }));

    app.use(roomRouter);
    app.use(messageRouter);

    app.use(errorMiddleware);

    app.listen(8080, () => {
      console.log('Application is running on port ', 8080);
    });
  })
  .catch(err => {
    console.error('[INIT]: ', err.message);
    /*
          Тут решил оставить так, но можно данную ситуация обкатать по-разному.
          Например: завершить процесс + в docker-compose добавить restart: always, чтобы был рестарт.
          Можно как вариант поставить интервал и пытаться заново ко всему подключиться, а потом в случае успеха
          запустить приложение
     */
  });
