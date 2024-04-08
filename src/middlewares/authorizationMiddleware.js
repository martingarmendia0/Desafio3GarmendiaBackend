// middlewares/authorizationMiddleware.js

const authorizeUser = (req, res, next) => {
    if (req.isAuthenticated()) {
        // Verifica el rol del usuario y autoriza según sea necesario
        if (req.user.role === 'admin') {
            // Si es administrador, permite el acceso
            return next();
        } else {
            // Si no es administrador, no autoriza y envía un error
            return res.status(403).json({ error: 'Acceso no autorizado' });
        }
    } else {
        // Si no está autenticado, envía un error de autenticación
        return res.status(401).json({ error: 'No autenticado' });
    }
};

module.exports = { authorizeUser };