const prisma = require('../../../config/prisma');
const { CarServiceError } = require('../errors/customErrors');

/**
 * Obtiene las imágenes asociadas a un carro por su ID.
 * @param {number|string} carId - ID del carro.
 * @returns {Array<Object>} Lista de imágenes asociadas al carro.
 */
async function getImagesByCarId(carId) {
  try {
    const images = await prisma.imagen.findMany({
      where: { id_carro: Number(carId) },
      orderBy: { id: 'asc' }, // Ordenar las imágenes por ID
    });
    return images;
  } catch (error) {
    throw new CarServiceError(`Error al obtener las imágenes del carro: ${error.message}`, 'PRISMA_ERROR', error);
  }
}

/**
 * Crea una nueva imagen asociada a un carro.
 * @param {number|string} carId - ID del carro.
 * @param {Buffer} imageData - Datos de la imagen en formato Buffer.
 * @returns {Object} La imagen creada.
 */
async function createImage(carId, imageData) {
  try {
    const newImage = await prisma.imagen.create({
      data: {
        id_carro: Number(carId),
        data: imageData,
      },
    });
    return newImage;
  } catch (error) {
    throw new CarServiceError(`Error al crear la imagen del carro: ${error.message}`, 'PRISMA_ERROR', error);
  }
}

/**
 * Elimina una imagen por su ID.
 * @param {number|string} imageId - ID de la imagen a eliminar.
 * @returns {Object} Resultado de la eliminación.
 */
async function deleteImage(imageId) {
  try {
    const deletedImage = await prisma.imagen.delete({
      where: { id: Number(imageId) },
    });
    return deletedImage;
  } catch (error) {
    throw new CarServiceError(`Error al eliminar la imagen: ${error.message}`, 'PRISMA_ERROR', error);
  }
}

/**
 * Actualiza una imagen existente.
 * @param {number|string} imageId - ID de la imagen a actualizar.
 * @param {Buffer} newImageData - Nuevos datos de la imagen en formato Buffer.
 * @returns {Object} La imagen actualizada.
 */
async function updateImage(imageId, newImageData) {
  try {
    const updatedImage = await prisma.imagen.update({
      where: { id: Number(imageId) },
      data: {
        data: newImageData,
      },
    });
    return updatedImage;
  } catch (error) {
    throw new CarServiceError(`Error al actualizar la imagen: ${error.message}`, 'PRISMA_ERROR', error);
  }
}

module.exports = {
  getImagesByCarId,
  createImage,
  deleteImage,
  updateImage,
};