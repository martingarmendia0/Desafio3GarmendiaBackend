// controllers/authController.js

const UserService = require('../services/UserService');
const userService = new UserService();

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const result = await userService.forgotPassword(email);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};