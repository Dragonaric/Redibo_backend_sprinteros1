const imageService = require('../services/imageService');

/**
 * Controlador para obtener las imágenes de un carro por su ID.
 * Transforma los datos de imagen (Buffer o array de bytes) a base64 para facilitar la visualización.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 */
async function getImagesByCarId(req, res) {
  const { carId } = req.query;
  const numericCarId = Number(carId);
  try {
    const images = await imageService.getImagesByCarId(numericCarId);
    const transformedImages = images.map(image => ({
      id: image.id,
      data: Buffer.isBuffer(image.data)
        ? image.data.toString('base64')
        : Buffer.from(image.data).toString('base64')
    }));
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.status(200).json({ success: true, data: transformedImages, total: transformedImages.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * Controlador para crear una nueva imagen asociada a un carro.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 */
async function createImage(req, res) {
  const { carId } = req.params;
  const imageData = req.file && req.file.buffer;
  if (!imageData) {
    return res.status(400).json({ error: 'No se proporcionó una imagen válida.' });
  }
  try {
    const newImage = await imageService.createImage(carId, imageData);
    res.status(201).json(newImage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * Controlador para eliminar una imagen por su ID.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 */
async function deleteImage(req, res) {
  const { imageId } = req.params;
  try {
    await imageService.deleteImage(imageId);
    res.status(200).json({ message: 'Imagen eliminada correctamente.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * Controlador para actualizar una imagen existente.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 */
async function updateImage(req, res) {
  const { imageId } = req.params;
  const newImageData = req.file && req.file.buffer;
  if (!newImageData) {
    return res.status(400).json({ error: 'No se proporcionó una imagen válida para actualizar.' });
  }
  try {
    const updatedImage = await imageService.updateImage(imageId, newImageData);
    res.status(200).json(updatedImage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getImagesByCarId,
  createImage,
  deleteImage,
  updateImage,
};
