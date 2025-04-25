const catalogService = require('../services/catalogService');

/**
 * Controlador para obtener las provincias asociadas a una ciudad específica.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 */
async function getProvincias(req, res) {
  const { ciudadId } = req.params;

  try {
    const provincias = await catalogService.getProvincias(parseInt(ciudadId, 10));
    res.status(200).json({ success: true, data: provincias });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Controlador para obtener todos los tipos de combustible disponibles.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 */
async function getCombustibles(req, res) {
  try {
    const combustibles = await catalogService.getCombustibles();
    res.status(200).json({ success: true, data: combustibles });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Controlador para obtener todas las características adicionales disponibles.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 */
async function getExtras(req, res) {
  try {
    const extras = await catalogService.getExtras();
    res.status(200).json({ success: true, data: extras });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = { getProvincias, getCombustibles, getExtras };