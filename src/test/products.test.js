const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Products API', () => {
    let productId;

    it('should create a new product', (done) => {
        chai.request(app)
            .post('/api/products')
            .send({
                title: 'Test Product',
                description: 'This is a test product',
                price: 99.99,
                owner: 'testuser@example.com'
            })
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('_id');
                productId = res.body._id;
                done();
            });
    });

    it('should fetch all products', (done) => {
        chai.request(app)
            .get('/api/products')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                done();
            });
    });

    it('should fetch a product by id', (done) => {
        chai.request(app)
            .get(`/api/products/${productId}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('_id').eql(productId);
                done();
            });
    });

    it('should update a product', (done) => {
        chai.request(app)
            .put(`/api/products/${productId}`)
            .send({
                title: 'Updated Test Product',
                description: 'This is an updated test product',
                price: 119.99
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message').eql('Producto modificado correctamente');
                done();
            });
    });

    it('should delete a product', (done) => {
        chai.request(app)
            .delete(`/api/products/${productId}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message').eql('Producto eliminado correctamente');
                done();
            });
    });
});