const prisma = require('../../../config/prisma');
const { CarServiceError } = require('../errors/customErrors');
const direccionService = require('../services/direccionService');
const imageService = require('../services/imageService');

/**
 * Crea un carro junto con sus imágenes asociadas en una transacción.
 * @param {Object} carData - Datos del carro.
 * @param {Array<string>} imagesBase64 - Lista de imágenes en formato base64.
 * @returns {Object} El carro creado junto con sus imágenes.
 */
async function createCarWithImages(carData, imagesBase64) {
  try {
    const result = await prisma.$transaction(async (prisma) => {
      // Crear el carro
      const newCar = await prisma.carro.create({
        data: carData,
      });

      // Insertar las imágenes asociadas al carro
      const images = await Promise.all(
        imagesBase64.map((base64) =>
          prisma.imagen.create({
            data: {
              id_carro: newCar.id,
              data: Buffer.from(base64, 'base64'), // Convertir base64 a Buffer
            },
          })
        )
      );

      return { car: newCar, images };
    });

    return result;
  } catch (error) {
    throw new CarServiceError(`Error al crear el carro con imágenes: ${error.message}`, 'TRANSACTION_ERROR', error);
  }
}

/**
 * Crea un carro completo desde un DTO, gestionando todas las entidades y relaciones necesarias.
 * @param {Object} dto - Datos del carro y sus relaciones.
 * @returns {Object} El carro creado junto con sus relaciones.
 */
async function createFullCar(dto) {
  const {
    direccion,
    carro,
    imagesBase64,
    combustibles,
    caracteristicas,
  } = dto;

  // Validación mínima del DTO
  if (!Array.isArray(combustibles) || combustibles.some((id) => !Number.isInteger(id))) {
    throw new CarServiceError('Los combustibles proporcionados son inválidos.', 'VALIDATION_ERROR');
  }
  if (!Array.isArray(caracteristicas) || caracteristicas.some((id) => !Number.isInteger(id))) {
    throw new CarServiceError('Las características adicionales proporcionadas son inválidas.', 'VALIDATION_ERROR');
  }

  console.info(`Iniciando creación de carro ${carro.vim} por usuarioRol ${carro.id_usuario_rol}`);
  const start = Date.now();

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Crear la dirección
      const newDireccion = await tx.direccion.create({
        data: direccion,
      });

      // Crear el carro con relaciones anidadas
      const newCar = await tx.carro.create({
        data: {
          ...carro, // Desplegar el objeto dto.carro
          id_direccion: newDireccion.id,
          combustiblesporCarro: {
            create: combustibles.map((id_combustible) => ({ id_combustible })),
          },
          caracteristicasAdicionalesCarro: {
            create: caracteristicas.map((id) => ({
              id_carasteristicasAdicionales: id
            })),
          },
          
          imagenes: {
            create: imagesBase64.map((base64) => ({
              data: Buffer.from(base64, 'base64'),
            })),
          },
        },
        include: {
          combustiblesporCarro:    { include: { combustible: true } },
          caracteristicasAdicionalesCarro: {
            include: { carasteristicasAdicionales: true }
          },
          imagenes: true,
        },
        
      });

      return { direccion: newDireccion, carro: newCar };
    });

    console.info(`Transacción fullCar completada en ${Date.now() - start} ms`);
    return result;
  } catch (error) {
    if (error.code === 'P2002') {
      throw new CarServiceError('Violación de restricción única.', 'CONFLICT_ERROR', error);
    }
    const err = new CarServiceError('Error al crear el carro completo.', 'TRANSACTION_ERROR');
    err.cause = error;
    throw err;
  }
}

module.exports = { createCarWithImages, createFullCar };