const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const HOST = 'http://localhost:8000';

chai.use(chaiHttp);

describe('/GET room', () => {
  it('it should GET all rooms (response with status 200)', async () => {
    const res = await chai.request(HOST).get('/room');

    res.should.have.status(200);
    res.body.should.have.property('items');
    res.body.should.have.property('items').be.a('array');
  });
});

describe('/GET room/:roomId/messages', () => {
  it('it should GET all messages in room (response with status 200)', async () => {
    const res = await chai.request(HOST).get('/room/1/messages');

    res.should.have.status(200);
    res.body.should.have.property('items');
    res.body.should.have.property('items').be.a('array');
  });
});

describe('/GET room/:roomId/messages', () => {
  it('it should GET all messages in room (response with status 404)', async () => {
    const res = await chai.request(HOST).get('/room/3/messages');

    res.should.have.status(404);
    res.body.should.have.property('error');
    res.body.should.have.property('error').be.a('string');
    res.body.should.have
      .property('error')
      .eql('Not found: room with specified identifier not found');
  });
});

describe('/GET room/:roomId/messages', () => {
  it('it should GET all messages in room (response with status 400)', async () => {
    const res = await chai.request(HOST).get('/room/test/messages');

    res.should.have.status(400);
    res.body.should.have.property('error');
    res.body.should.have.property('error').be.a('string');
    res.body.should.have
      .property('error')
      .eql('Bad request: roomId is invalid');
  });
});
