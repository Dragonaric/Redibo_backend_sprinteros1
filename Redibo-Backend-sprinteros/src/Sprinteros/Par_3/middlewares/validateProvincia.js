const catalogService = require('../services/catalogService');

/**
 * Middleware para validar que la provincia seleccionada pertenece a la ciudad indicada.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @param {Function} next - Función para pasar al siguiente middleware.
 */
async function validateProvincia(req, res, next) {
  const ciudadId = Number(req.body.ciudadId);
  const provinciaId = Number(req.body.provinciaId);

  // Validar que los IDs sean números válidos
  if (Number.isNaN(ciudadId) || Number.isNaN(provinciaId)) {
    return res.status(400).json({
      success: false,
      errors: [
        { field: 'ciudadId', message: 'El ID de la ciudad es inválido.' },
        { field: 'provinciaId', message: 'El ID de la provincia es inválido.' },
      ],
    });
  }

  try {
    // Obtener las provincias asociadas a la ciudad indicada
    const provincias = await catalogService.getProvincias(ciudadId);

    // Verificar si la provincia existe en la lista de provincias de la ciudad
    if (!provincias.some((p) => p.id === provinciaId)) {
      return res.status(400).json({
        success: false,
        errors: [
          {
            field: 'provinciaId',
            message: `La provincia con ID ${provinciaId} no pertenece a la ciudad con ID ${ciudadId}.`,
          },
        ],
      });
    }

    // Pasar al siguiente middleware si la provincia es válida
    next();
  } catch (error) {
    // Delegar el manejo del error al middleware global
    next(error);
  }
}

module.exports = validateProvincia;