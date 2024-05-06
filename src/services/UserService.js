// services/UserService.js

const UserRepository = require('../repositories/UserRepository');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

class UserService {
    constructor() {
        this.userRepository = UserRepository.getUserDAO(); // Obtén el repositorio deseado
    }

    async createUser(userData) {
        return await this.userRepository.createUser(userData);
    }

    async forgotPassword(email) {
        try {
            const user = await this.userRepository.getUserByEmail(email);

            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

            const transporter = nodemailer.createTransport({
                // Configurar el transporte de correo
            });

            const mailOptions = {
                from: 'your_email@example.com',
                to: email,
                subject: 'Recuperación de contraseña',
                html: `<p>Haga clic en el siguiente enlace para restablecer su contraseña:</p><p><a href="http://localhost:8080/reset-password/${token}">Restablecer contraseña</a></p>`
            };

            await transporter.sendMail(mailOptions);
            return { message: 'Correo electrónico enviado con éxito' };
        } catch (error) {
            throw new Error('Error al procesar la solicitud de restablecimiento de contraseña');
        }
    }

    async resetPassword(token, newPassword) {
        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decodedToken.userId;

            // Lógica para restablecer la contraseña
            // Verificar si la nueva contraseña es diferente a la anterior
            // Manejar la expiración del token

            return { message: 'Contraseña restablecida exitosamente' };
        } catch (error) {
            throw new Error('Error al restablecer la contraseña');
        }
    }
}

module.exports = UserService;