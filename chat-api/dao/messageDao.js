const db = require('../services/connection').getDatabaseConnection();

const messagesByRoomId = roomId => {
  const query = `
        SELECT
            text,
            json_build_object('id', r.id, 'name', r.name) AS room,
            json_build_object('id', u.id, 'name', u.name, 'avatar', u.avatar) AS user
        FROM messages AS m
        JOIN rooms AS r ON r.id = m.room
        JOIN users AS u ON u.id = m.user
        WHERE
            m.room = $1
        ORDER BY m.id DESC
    `;

  return db.any({ text: query, values: [roomId] });
};

const createMessage = message => {
  const query = `
        INSERT INTO messages (text, room, "user") VALUES ($1, $2, $3)
    `;

  return db.none({
    text: query,
    values: [message.text, message.room.id, message.user.id]
  });
};

module.exports = {
  messagesByRoomId,
  createMessage
};
