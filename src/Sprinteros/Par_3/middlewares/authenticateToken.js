// src/middlewares/authenticateToken.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Middleware para autenticar al usuario mediante un token JWT.
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token no proporcionado' });
  }

  const secretKey = process.env.JWT_SECRET || 'dev-secret-key';

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = {
      id_usuario: decoded.id_usuario,
      id_usuario_rol: decoded.id_usuario_rol,
    };
    return next();
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Token inválido o expirado' });
  }
}

module.exports = authenticateToken;
