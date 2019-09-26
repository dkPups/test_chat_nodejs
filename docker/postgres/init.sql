CREATE SEQUENCE IF NOT EXISTS room_id_seq;
CREATE SEQUENCE IF NOT EXISTS message_id_seq;
CREATE SEQUENCE IF NOT EXISTS user_id_seq;

CREATE TABLE IF NOT EXISTS users
(
  id       INTEGER PRIMARY KEY DEFAULT nextval('user_id_seq'),
  name     VARCHAR(255) NOT NULL,
  avatar   VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS rooms
(
  id     INTEGER PRIMARY KEY DEFAULT nextval('room_id_seq'),
  name   VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS messages
(
  id     INTEGER PRIMARY KEY DEFAULT nextval('message_id_seq'),
  text   TEXT,
  room   INTEGER REFERENCES rooms(id),
  "user"   INTEGER REFERENCES users(id)
);

ALTER SEQUENCE user_id_seq
  OWNED BY users.id;

ALTER SEQUENCE message_id_seq
  OWNED BY messages.id;

ALTER SEQUENCE room_id_seq
  OWNED BY rooms.id;

INSERT INTO users (name, avatar) VALUES
('test_user_1', 'http://test.com/t_avatar.jpg'),
('test_user_2', 'http://test.com/t2_avatar.jpg');

INSERT INTO rooms (name) VALUES
('test_room_1'),
('test_room_2');