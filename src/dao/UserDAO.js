const User = require('../models/User');

exports.findUserByEmail = async (email) => {
    return await User.findOne({ email });
};