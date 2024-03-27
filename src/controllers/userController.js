const { User } = require('../db');

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