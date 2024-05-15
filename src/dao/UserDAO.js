const User = require('./models/UserModel');

exports.findUserByEmail = async (email) => {
    return await User.findOne({ email });
};