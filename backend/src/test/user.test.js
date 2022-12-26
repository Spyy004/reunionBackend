const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();

chai.use(chaiHttp);

describe('Users', () => {
    const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzYTk2Y2NlMTc1NzVlZDhmN2QzNTE1YyIsImVtYWlsIjoidGVzdEBnbWFpbC5jb20iLCJpYXQiOjE2NzIwNTYxNjMsImV4cCI6MTY3MjE0MjU2M30.Z2wQ5HSgm1xW_VOypLbixe4LWs1w2SXA2ZMLtcauKGE";
    it('should get the authenticated user profile on /api/users/user GET', done => {
      chai
        .request(server)
        .get('/api/users/user')
        .set('Authorization', `Bearer ${TOKEN}`) // Set the JWT token in the Authorization header
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('name');
          res.body.should.have.property('followers');
          res.body.should.have.property('followings');
          done();
        });
    });
    it('should authenticate the user and return a JWT token on /api/authenticate POST', done => {
      chai
        .request(server)
        .post('/api/users/authenticate')
        .send({ email: 'test@gmail.com', password: 'test@123' }) // Send the input parameters in the request body
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('token'); // Check that the response includes a token property
          done();
        });
    });
  });