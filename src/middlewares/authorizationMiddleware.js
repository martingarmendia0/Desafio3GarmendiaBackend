// middlewares/authorizationMiddleware.js

const authorizeUser = (allowedRoles) => {
    return (req, res, next) => {
        if (req.isAuthenticated()) {
            // Verifica si el usuario tiene un rol permitido
            if (allowedRoles.includes(req.user.role)) {
                // Si el rol del usuario está permitido, permite el acceso
                return next();
            } else {
                // Si el rol del usuario no está permitido, envía un error
                return res.status(403).json({ error: 'No tienes permiso para realizar esta acción' });
            }
        } else {
            // Si el usuario no está autenticado, envía un error de autenticación
            return res.status(401).json({ error: 'No autenticado' });
        }
    };
};

module.exports = { authorizeUser };