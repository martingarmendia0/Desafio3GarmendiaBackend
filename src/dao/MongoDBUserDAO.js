// dao/MongoDBUserDAO.js

const User = require('./models/UserModel');

class MongoDBUserDAO {
    async createUser(userData) {
        try {
            const newUser = new User(userData);
            await newUser.save();
            return newUser;
        } catch (error) {
            throw new Error('Error creating user');
        }
    }

    async findUserByEmail(email) {
        try {
            const user = await User.findOne({ email });
            return user;
        } catch (error) {
            throw new Error('Error finding user by email');
        }
    }
}

module.exports = MongoDBUserDAO;