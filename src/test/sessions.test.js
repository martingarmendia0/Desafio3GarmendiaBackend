const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Sessions API', () => {
    let userToken;

    it('should register a new user', (done) => {
        chai.request(app)
            .post('/api/sessions/register')
            .send({
                first_name: 'Test',
                last_name: 'User',
                email: 'testuser@example.com',
                age: 30,
                password: 'password123'
            })
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message').eql('Usuario registrado correctamente');
                done();
            });
    });

    it('should log in the user and return a token', (done) => {
        chai.request(app)
            .post('/api/sessions/login')
            .send({
                email: 'testuser@example.com',
                password: 'password123'
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('token');
                userToken = res.body.token;
                done();
            });
    });

    it('should get the user profile using the token', (done) => {
        chai.request(app)
            .get('/api/sessions/profile')
            .set('Authorization', `Bearer ${userToken}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('email').eql('testuser@example.com');
                done();
            });
    });
});