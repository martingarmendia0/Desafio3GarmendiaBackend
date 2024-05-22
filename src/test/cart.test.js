const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); 

chai.use(chaiHttp);
const expect = chai.expect;

describe('Carts API', () => {
    let cartId;
    let productId = '60f7e6bba42b0000d4e62c7c';
    
    it('should create a new cart', (done) => {
        chai.request(app)
            .post('/api/carts')
            .send({ products: [{ product: productId, quantity: 1 }] })
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('_id');
                cartId = res.body._id;
                done();
            });
    });

    it('should fetch all carts', (done) => {
        chai.request(app)
            .get('/api/carts')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                done();
            });
    });

    it('should fetch a cart by id', (done) => {
        chai.request(app)
            .get(`/api/carts/${cartId}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('_id').eql(cartId);
                done();
            });
    });

    it('should update a cart', (done) => {
        chai.request(app)
            .put(`/api/carts/${cartId}`)
            .send({ products: [{ product: productId, quantity: 2 }] })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message').eql('Carrito actualizado correctamente');
                done();
            });
    });

    it('should delete a cart', (done) => {
        chai.request(app)
            .delete(`/api/carts/${cartId}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message').eql('Carrito eliminado correctamente');
                done();
            });
    });
});