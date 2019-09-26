const router = require('express').Router();
const roomDao = require('../dao/roomDao');
const messsageDao = require('../dao/messageDao');
const RequestError = require('../helpers/RequestError');

router.get('/room', async (req, res, next) => {
  try {
    const rooms = await roomDao.rooms();

    return res.json({
      items: rooms
    });
  } catch (err) {
    console.error('[GET][ROOM]: ', err.message);
    next(new RequestError(500));
  }
});

router.get('/room/:roomId/messages', async (req, res, next) => {
  try {
    const roomId = +req.params.roomId;

    if (!roomId) {
      return next(new RequestError(400, 'Bad request: roomId is invalid'));
    }

    const room = await roomDao.roomById(roomId);

    if (!room.length) {
      return next(
        new RequestError(
          404,
          'Not found: room with specified identifier not found'
        )
      );
    }

    const messages = await messsageDao.messagesByRoomId(roomId);

    return res.json({
      items: messages
    });
  } catch (err) {
    console.error('[GET][ROOM_MESSAGES]: ', err.message);
    next(new RequestError(500));
  }
});

module.exports = router;
