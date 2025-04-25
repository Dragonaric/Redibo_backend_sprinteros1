// src/errors/customErrors.js
class CarServiceError extends Error {
    constructor(message, type = 'DB_ERROR', originalError = null) {
      super(message);
      this.type = type;
      this.originalError = originalError;
    }
  }
  
  module.exports = { CarServiceError };
  