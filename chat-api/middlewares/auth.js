const RequestError = require('../helpers/RequestError');

function auth(req, res, next) {
  /*
        Так как отсутствует авторизация, то пришлось сделать таким образом. Если бы она была,
        то тогда бы при авторизации делал бы req.session.user = {данные пользователя}, и
        соответственно проверял бы уже не только наличие cookie, но еще и req.session.user,
        на данный момент придется при каждом запросе подставлять самому req.session.user
  */
  if (req.cookies[process.env.SESSION_NAME] === '11') {
    req.session = {
      user: {
        id: 1,
        name: 'test_user_1',
        avatar: 'http://test.com/t_avatar.jpg'
      }
    };

    next();
  } else {
    next(
      new RequestError(
        401,
        'Not authorized: only authorized users can send messages'
      )
    );
  }
}

module.exports = auth;
