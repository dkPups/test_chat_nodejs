const db = require('../services/connection').getDatabaseConnection();

const rooms = () => db.any('SELECT * FROM rooms ORDER BY id DESC');

// Использую .any, так как при .one в случае, если не найдена запись будет возвращена ошибка, потом их отлавливать будет проблематично
const roomById = roomId =>
  db.any({ text: 'SELECT * FROM rooms WHERE id = $1', values: [roomId] });

module.exports = {
  rooms,
  roomById
};
