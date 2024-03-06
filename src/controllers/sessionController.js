const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Función para generar un token JWT con duración de 1 minuto
const generateToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1m' });
};

// Función para verificar y autenticar al usuario
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar el usuario en la base de datos por su correo electrónico
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Generar y enviar el token JWT al cliente
        const token = generateToken(user);
        res.status(200).json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};