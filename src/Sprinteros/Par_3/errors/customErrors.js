/**
 * Clase personalizada para manejar errores específicos del servicio de carros.
 */
class CarServiceError extends Error {
  /**
   * Constructor del error personalizado.
   * @param {string} message - Mensaje descriptivo del error.
   * @param {string} code - Código del error (por ejemplo, VALIDATION_ERROR, CONFLICT_ERROR).
   * @param {Error} [originalError] - Error original (opcional) para propagar detalles adicionales.
   */
  constructor(message, code, originalError = null) {
    super(message);
    this.name = 'CarServiceError';
    this.code = code;
    this.originalError = originalError;

    // Captura el stack trace del error original si está disponible
    if (originalError && originalError.stack) {
      this.stack += `\nCaused by: ${originalError.stack}`;
    }
  }
}

module.exports = { CarServiceError };