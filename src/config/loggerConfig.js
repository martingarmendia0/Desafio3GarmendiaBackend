const { createLogger, format, transports } = require('winston');

// Definir niveles de prioridad
const levels = {
    debug: 0,
    http: 1,
    info: 2,
    warning: 3,
    error: 4,
    fatal: 5
};

// Crear logger de desarrollo
const developmentLogger = createLogger({
    levels: levels,
    format: format.simple(),
    transports: [
        new transports.Console()
    ],
    level: 'debug' // Loguear a partir de nivel 'debug'
});

// Crear logger de producción
const productionLogger = createLogger({
    levels: levels,
    format: format.combine(
        format.timestamp(),
        format.simple()
    ),
    transports: [
        new transports.File({ filename: 'errors.log', level: 'error' }) // Loguear a partir de nivel 'error' en archivo 'errors.log'
    ],
    level: 'info' // Loguear a partir de nivel 'info'
});

module.exports = { developmentLogger, productionLogger };