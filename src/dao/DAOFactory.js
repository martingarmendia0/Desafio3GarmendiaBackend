// daos/DAOFactory.js

const MongoDBUserDAO = require('./MongoDBUserDAO');
const MongoDBCartDAO = require('./MongoDBCartDAO');

class DAOFactory {
    static getUserDAO() {
        // Devuelve una instancia del DAO de usuarios para MongoDB
        return new MongoDBUserDAO();
    }

    static getCartDAO() {
        // Devuelve una instancia del DAO de carritos para MongoDB
        return new MongoDBCartDAO();
    }
}

module.exports = DAOFactory;