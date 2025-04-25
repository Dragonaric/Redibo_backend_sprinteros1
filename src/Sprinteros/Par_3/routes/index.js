const express = require('express');
const carRoutes = require('./carRoutes');
const direcRoutes = require('./direcRoutes');
const imageRoutes = require('./imageRoutes');
const catalogRoutes = require('./catalogRoutes');

const router = express.Router();

/**
 * Montar las rutas de la API con prefijo /api/v2
 * Cada módulo tiene su propio conjunto de rutas.
 */

// Rutas para gestión de carros
router.use('/cars', carRoutes);

// Rutas para gestión de direcciones
router.use('/direc', direcRoutes);

// Rutas para gestión de imágenes
router.use('/images', imageRoutes);

// Rutas para gestión de catálogos
router.use('/catalog', catalogRoutes);

// Middleware global para manejar errores no capturados
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
  });
});

module.exports = router;