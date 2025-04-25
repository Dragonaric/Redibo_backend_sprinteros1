const prisma = require('../../../config/prisma');

/**
 * Obtiene las provincias asociadas a una ciudad específica.
 * @param {number} ciudadId - ID de la ciudad.
 * @returns {Promise<Array>} Lista de provincias asociadas.
 */
async function getProvincias(ciudadId) {
  if (!Number.isInteger(ciudadId)) {
    throw new Error('El ID de la ciudad debe ser un número entero válido.');
  }

  try {
    return await prisma.provincia.findMany({
      where: { id_ciudad: ciudadId },
      select: { id: true, nombre: true },
      orderBy: { nombre: 'asc' },
    });
  } catch (error) {
    throw Object.assign(error, {
      message: `Error al obtener provincias (ciudad ${ciudadId}): ${error.message}`,
    });
  }
}

/**
 * Obtiene todos los tipos de combustible disponibles.
 * @returns {Promise<Array>} Lista de tipos de combustible.
 */
async function getCombustibles() {
  try {
    return await prisma.tipoCombustible.findMany({
      select: { id: true, tipoDeCombustible: true },
    });
  } catch (error) {
    throw Object.assign(error, {
      message: `Error al obtener los tipos de combustible: ${error.message}`,
    });
  }
}

/**
 * Obtiene todas las características adicionales disponibles.
 * @returns {Promise<Array>} Lista de características adicionales.
 */
async function getExtras() {
  try {
    return await prisma.carasteristicasAdicionales.findMany({
      select: { id: true, nombre: true },
    });
  } catch (error) {
    throw Object.assign(error, {
      message: `Error al obtener las características adicionales: ${error.message}`,
    });
  }
}

module.exports = {
  getProvincias,
  getCombustibles,
  getExtras,
};