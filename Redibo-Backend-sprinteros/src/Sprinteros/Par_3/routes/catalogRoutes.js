const express = require('express');
const asyncHandler = require('express-async-handler');
const catalogController = require('../controllers/catalogController');
const { query } = require('express-validator');

const router = express.Router();

/**
 * Middleware para cachear respuestas de endpoints estáticos.
 */
function cache(req, res, next) {
  res.set('Cache-Control', 'public, max-age=3600'); // Cache por 1 hora
  next();
}

// Rutas para gestionar los catálogos
/**
 * @swagger
 * /catalog/provincias:
 *   get:
 *     summary: Listar provincias por ciudad
 *     parameters:
 *       - in: query
 *         name: ciudadId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la ciudad para filtrar provincias
 *     responses:
 *       200:
 *         description: Lista de provincias
 */
router.get(
  '/provincias',
  cache,
  query('ciudadId').isInt().withMessage('El ID de la ciudad debe ser un número entero').toInt(),
  asyncHandler(catalogController.getProvincias)
);

router.get('/combustibles', cache, asyncHandler(catalogController.getCombustibles));
router.get('/extras', cache, asyncHandler(catalogController.getExtras));

module.exports = router;