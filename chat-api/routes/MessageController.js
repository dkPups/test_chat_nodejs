const router = require('express').Router();
const sendToQueue = require('../services/producer');
const RequestError = require('../helpers/RequestError');
const authMiddleware = require('../middlewares/auth');
const messageDao = require('../dao/messageDao');
const roomDao = require('../dao/roomDao');

router.post('/message', authMiddleware, async (req, res, next) => {
  try {
    const isNotValid =
      !req.body ||
      !Object.keys(req.body).length ||
      !req.body.room ||
      !req.body.text;

    if (isNotValid) {
      return next(
        new RequestError(
          400,
          'Bad request: required parameters missing or invalid'
        )
      );
    }

    const message = {
      user: req.session.user,
      ...req.body
    };

    message.room = await roomDao.roomById(message.room);

    if (!message.room.length) {
      return next(new RequestError(404, 'Not found: room not found'));
    }

    message.room = message.room[0];

    await messageDao.createMessage(message);

    await sendToQueue(JSON.stringify(message), true);

    return res.status(201).json(message);
  } catch (err) {
    console.error('[POST][MESSAGE]: ', err.message);
    next(new RequestError(500));
  }
});

module.exports = router;
