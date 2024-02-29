const { User } = require('../db');

exports.loginUser = async (req, res) => {
    try {
        // Extraer datos del cuerpo de la solicitud
        const { email, password } = req.body;

        // Buscar el usuario en la base de datos por su correo electrónico
        const user = await User.findOne({ email });

        // Verificar si el usuario existe y la contraseña es correcta
        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Establecer la sesión del usuario
        req.session.user = user;

        // Redireccionar al usuario a la vista de productos
        res.redirect('/realTimeProducts');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};