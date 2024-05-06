// userController.js

const { User } = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    try {
        // Extraer datos del cuerpo de la solicitud
        const { first_name, last_name, email, age, password } = req.body;

        // Crear un nuevo usuario en la base de datos
        const newUser = new User({ first_name, last_name, email, age, password });
        await newUser.save();

        res.status(201).json({ message: 'Usuario registrado correctamente' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.resetPassword = async (req, res) => {
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