const chai = require('chai');
const chaiHttp = require('chai-http');
const socket = require('socket.io-client')('http://localhost:3000');
const should = chai.should();
const message = {
  text: 'Привет, dkPups!',
  room: 1
};
const user = {
  id: 1,
  session: 'sessionId=11'
};
const HOST = 'http://localhost:8000';

chai.use(chaiHttp);

/*
    Опыта с автотестами мало, поэтому решил написать просто таким образом. Подключение к сокету и отключение
    скорее всего надо было вынести в какие-то стадии before и after соответственно, но таким образом тоже работает,
    поэтому решил оставить в таком виде.
 */

describe('/GET room', () => {
  it('Клиент запрашивает список чат-комнат', async () => {
    const res = await chai.request(HOST).get('/room');
    res.should.have.status(200);
    res.body.should.have.property('items');
    res.body.should.have.property('items').be.a('array');
  });
});

describe('/GET room/:roomId/messages', () => {
  it('Клиент получает список сообщений для любой чат-комнаты', async () => {
    const res = await chai.request(HOST).get('/room/1/messages');
    res.should.have.status(200);
    res.body.should.have.property('items');
    res.body.should.have.property('items').be.a('array');
  });
});

describe('/POST message', () => {
  it('1. Клиент отправляет сообщение в любую чат-комнату; 2. Клиент получает ОДНО новое сообщение по WS не позднее чем через 200мс после отправки;', done => {
    socket.on('newMessage', msg => {
      msg.should.have.property('text');
      msg.should.have.property('text').be.a('string');
      msg.should.have.property('room').be.a('object');
      msg.should.have.property('room').have.property('id');
      msg.should.have
        .property('room')
        .have.property('id')
        .be.a('number');
      msg.should.have.property('room').have.property('name');
      msg.should.have
        .property('room')
        .have.property('name')
        .be.a('string');
      msg.should.have.property('user').be.a('object');
      msg.should.have.property('user').have.property('id');
      msg.should.have
        .property('user')
        .have.property('id')
        .be.a('number');
      msg.should.have.property('user').have.property('name');
      msg.should.have
        .property('user')
        .have.property('name')
        .be.a('string');
      msg.should.have.property('user').have.property('avatar');
      msg.should.have
        .property('user')
        .have.property('avatar')
        .be.a('string');
      socket.disconnect();
      done();
    });

    chai
      .request(HOST)
      .post('/message')
      .set('Cookie', user.session)
      .send(message)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.have.property('text');
        res.body.should.have.property('text').be.a('string');
        res.body.should.have.property('room').be.a('object');
        res.body.should.have.property('room').have.property('id');
        res.body.should.have
          .property('room')
          .have.property('id')
          .be.a('number');
        res.body.should.have.property('room').have.property('name');
        res.body.should.have
          .property('room')
          .have.property('name')
          .be.a('string');
        res.body.should.have.property('user').be.a('object');
        res.body.should.have.property('user').have.property('id');
        res.body.should.have
          .property('user')
          .have.property('id')
          .be.a('number');
        res.body.should.have.property('user').have.property('name');
        res.body.should.have
          .property('user')
          .have.property('name')
          .be.a('string');
        res.body.should.have.property('user').have.property('avatar');
        res.body.should.have
          .property('user')
          .have.property('avatar')
          .be.a('string');
      });
  });
});

describe('/POST message', () => {
  it('Клиент получает список сообщений для чат-комнаты в которую отправил сообщение и удостоверяется что там есть новое сообщение', async () => {
    const res = await chai.request(HOST).get('/room/1/messages');
    res.should.have.status(200);
    res.body.should.have.property('items');
    res.body.should.have.property('items').be.a('array');

    const msg = res.body.items[0];
    msg.should.have.property('text').eq(message.text);
    msg.should.have
      .property('room')
      .have.property('id')
      .eq(message.room);
    msg.should.have
      .property('user')
      .have.property('id')
      .eq(user.id);
  });
});
