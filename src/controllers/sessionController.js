const { User } = require('../dao/models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'El usuario no existe' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset',
            text: `You requested a password reset. Please use the following token to reset your password: ${token}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Correo enviado con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, password, token } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'El usuario no existe' });
        }

        const isValidToken = jwt.verify(token, process.env.JWT_SECRET);

        if (!isValidToken) {
            return res.status(400).json({ error: 'El token no es válido o ha expirado' });
        }

        if (await bcrypt.compare(password, user.password)) {
            return res.status(400).json({ error: 'La nueva contraseña debe ser diferente a la actual' });
        }

        user.password = await bcrypt.hash(password, 10);
        await user.save();

        res.status(200).json({ message: 'Contraseña restablecida correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const authorizeUser = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

module.exports = {
    authorizeUser,
    forgotPassword,
    resetPassword
};