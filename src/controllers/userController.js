const { User } = require('../models/User');  // Asegúrate de que el modelo esté importado correctamente
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ first_name, last_name, email, age, password: hashedPassword });
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

exports.updateUserToPremium = async (req, res) => {
    try {
        const { uid } = req.params;
        const user = await User.findById(uid);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const requiredDocuments = ['Identificación', 'Comprobante de domicilio', 'Comprobante de estado de cuenta'];
        const uploadedDocuments = user.documents.map(doc => doc.name);

        const allDocumentsUploaded = requiredDocuments.every(doc => uploadedDocuments.includes(doc));

        if (!allDocumentsUploaded) {
            return res.status(400).json({ error: 'No se han cargado todos los documentos requeridos' });
        }

        user.role = 'premium';
        await user.save();

        res.status(200).json({ message: 'Usuario actualizado a premium' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.uploadDocuments = async (req, res) => {
    try {
        const { uid } = req.params;
        const files = req.files;

        const user = await User.findById(uid);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        files.forEach(file => {
            user.documents.push({ name: file.originalname, reference: file.path });
        });

        await user.save();

        res.status(200).json({ message: 'Documentos subidos correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};