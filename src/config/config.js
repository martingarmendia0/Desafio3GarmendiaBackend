require('dotenv').config();

module.exports = {
    dbURI: process.env.DB_URI,
    jwtSecret: process.env.JWT_SECRET
};