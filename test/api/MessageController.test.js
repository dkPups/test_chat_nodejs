const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const HOST = 'http://localhost:8000';

chai.use(chaiHttp);

describe('/POST message', () => {
  it('it should CREATE message (response with status 401)', async () => {
    const message = {
      room: 1,
      text: 'Привет, мир!'
    };

    const res = await chai
      .request(HOST)
      .post('/message')
      .send(message);

    res.should.have.status(401);
    res.body.should.have.property('error');
    res.body.should.have.property('error').be.a('string');
    res.body.should.have
      .property('error')
      .eql('Not authorized: only authorized users can send messages');
  });
});

describe('/POST message', () => {
  it('it should CREATE message (response with status 400)', async () => {
    const message = {
      text: 'Привет, мир!'
    };

    const res = await chai
      .request(HOST)
      .post('/message')
      .set('Cookie', 'sessionId=11')
      .send(message);

    res.should.have.status(400);
    res.body.should.have.property('error');
    res.body.should.have.property('error').be.a('string');
    res.body.should.have
      .property('error')
      .eql('Bad request: required parameters missing or invalid');
  });
});

describe('/POST message', () => {
  it('it should CREATE message (response with status 404)', async () => {
    const message = {
      text: 'Привет, мир!',
      room: 4
    };

    const res = await chai
      .request(HOST)
      .post('/message')
      .set('Cookie', 'sessionId=11')
      .send(message);

    res.should.have.status(404);
    res.body.should.have.property('error');
    res.body.should.have.property('error').be.a('string');
    res.body.should.have.property('error').eql('Not found: room not found');
  });
});

describe('/POST message', () => {
  it('it should CREATE message (response with status 201)', async () => {
    const message = {
      text: 'Привет, мир!',
      room: 1
    };

    const res = await chai
      .request(HOST)
      .post('/message')
      .set('Cookie', 'sessionId=11')
      .send(message);

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

describe('/POST message', () => {
  it('it should CREATE message (test websocket)', async () => {
    const message = {
      text: 'Привет, мир!',
      room: 1
    };

    const res = await chai
      .request(HOST)
      .post('/message')
      .set('Cookie', 'sessionId=11')
      .send(message);

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
