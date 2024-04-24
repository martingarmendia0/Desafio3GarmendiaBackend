// ErrorCustomizer.js
const errorDictionary = {
    MISSING_TITLE: 'El título del producto es requerido',
    MISSING_PRICE: 'El precio del producto es requerido',
};

// Función para personalizar los errores
const customizeError = (errorType, additionalInfo = {}) => {
    const errorMessage = errorDictionary[errorType];
    if (!errorMessage) {
        return 'Error desconocido';
    }
    return { error: errorMessage, ...additionalInfo };
};

module.exports = { customizeError };