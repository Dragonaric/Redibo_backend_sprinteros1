const prisma = require('../../../config/prisma'); // Instancia única compartida
const { CarServiceError } = require('../errors/customErrors');

/**
 * Obtiene la lista de carros, permitiendo la paginación y filtrado por host.
 * @param {Object} params - Parámetros de consulta.
 * @param {number} params.skip - Saltar N registros (paginación).
 * @param {number} params.take - Cantidad de registros a tomar.
 * @param {number} [params.hostId] - (Opcional) ID del host para filtrar los registros.
 * @returns {Object} Objeto con la cuenta total y la lista de carros.
 */
async function getCars({ skip = 0, take = 10, hostId } = {}) {
  // Construir filtro (where) en función de si se provee hostId
  const whereFilter = hostId ? { id_usuario_rol: hostId } : {};
  try {
    const [total, cars] = await prisma.$transaction([
      prisma.carro.count({ where: whereFilter }),
      prisma.carro.findMany({
        skip,
        take,
        where: whereFilter,
        orderBy: { id: 'desc' }
      })
    ]);
    return { total: total || 0, cars: cars || [] };
  } catch (error) {
    throw new CarServiceError(`Error fetching cars: ${error.message}`, 'PRISMA_ERROR', error);
  }
}

/**
 * Crea un nuevo carro.
 * Se espera que 'data' contenga la información necesaria, incluyendo el id del host (id_usuario_rol).
 * @param {Object} data - Datos del carro a crear.
 * @returns {Object} El carro creado.
 */
async function createCar(data) {
  try {
    if (!data.id_usuario_rol) {
      throw new Error('ID de host es requerido para crear un carro');
    }
    return await prisma.carro.create({ data });
  } catch (error) {
    throw new CarServiceError('Error al crear carro', 'DB_ERROR', error);
  }
}

/**
 * Obtiene un carro por su ID.
 * @param {number|string} id - ID del carro.
 * @returns {Object} El carro encontrado.
 */
async function getCarById(id) {
  try {
    const car = await prisma.carro.findUnique({
      where: { id: Number(id) },
    });
    if (!car) {
      throw new CarServiceError('Carro no encontrado', 'NOT_FOUND');
    }
    return car;
  } catch (error) {
    throw new CarServiceError(`Error al obtener el carro: ${error.message}`, 'PRISMA_ERROR', error);
  }
}

/**
 * Actualiza la información de un carro existente.
 * @param {number|string} id - ID del carro a actualizar.
 * @param {Object} data - Datos a actualizar.
 * @returns {Object} El carro actualizado.
 */
async function updateCar(id, data) {
  try {
    const updatedCar = await prisma.carro.update({
      where: { id: Number(id) },
      data,
    });
    return updatedCar;
  } catch (error) {
    throw new CarServiceError(`Error al actualizar el carro: ${error.message}`, 'PRISMA_ERROR', error);
  }
}

/**
 * Manejo genérico de operaciones con Prisma para centralizar el tratamiento de errores.
 * @param {Function} operation - Operación a ejecutar (retorna una Promise).
 * @returns {Promise} Resultado de la operación.
 */
async function handlePrismaOperation(operation) {
  try {
    return await operation();
  } catch (error) {
    if (error.code === 'P2025') { // Registro no encontrado
      throw new CarServiceError('Recurso no encontrado', 'NOT_FOUND');
    }
    throw new CarServiceError(error.message, 'PRISMA_ERROR', error);
  }
}

/**
 * Elimina un carro por su ID.
 * @param {number|string} id - ID del carro a eliminar.
 * @returns {Object} Resultado de la eliminación.
 */
async function deleteCar(id) {
  return handlePrismaOperation(() =>
    prisma.carro.delete({ where: { id: Number(id) } })
  );
}

module.exports = { getCars, createCar, getCarById, updateCar, deleteCar };
