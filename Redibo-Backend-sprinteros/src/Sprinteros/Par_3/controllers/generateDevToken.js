// src/controllers/generateDevToken.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Controlador para generar un token de desarrollo
const generateDevToken = (req, res) => {
  const secretKey = process.env.JWT_SECRET || 'dev-secret-key';
  const expiresIn = process.env.DEV_TOKEN_EXPIRES_IN || '1h';

  // Payload estático para entorno de desarrollo
  const payload = {
    id_usuario: 1,
    id_usuario_rol: 1,
  };

  try {
    const token = jwt.sign(payload, secretKey, { expiresIn });
    return res.status(200).json({
      success: true,
      token,
      message: 'Token de desarrollo generado exitosamente',
    });
  } catch (error) {
    console.error('Error al generar el token de desarrollo:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al generar el token de desarrollo',
      error: error.message,
    });
  }
};

module.exports = { generateDevToken };
