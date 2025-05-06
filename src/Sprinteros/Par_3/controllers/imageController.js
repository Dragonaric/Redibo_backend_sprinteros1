
const asyncHandler        = require('../middlewares/asyncHandler');
const { uploadCarImage, updateCarImage, getCarImages, deleteCarImage } = require('../services/imageService');

exports.getImagesByCarId = asyncHandler(async (req, res) => {
  const carId    = Number(req.params.carId);
  const page     = parseInt(req.query.page)     || 1;
  const pageSize = parseInt(req.query.pageSize) || 20;
  const result   = await getCarImages(carId, { page, pageSize });
  res.json(result);
});

exports.createImage = asyncHandler(async (req, res) => {
  const carId = Number(req.params.carId);
  if (!req.file?.buffer) {
    return res.status(400).json({ success: false, message: 'No hay archivo en la petición' });
  }
  const { success, data: image } = await uploadCarImage(req.file.buffer, carId);
  res.status(201).json({ success, image });
});

exports.updateImage = asyncHandler(async (req, res) => {
  const imageId = Number(req.params.imageId);
  if (!req.file?.buffer) {
    return res.status(400).json({ success: false, message: 'No hay archivo en la petición' });
  }
  const { success, data: updatedImage } = await updateCarImage(req.file.buffer, imageId);
  res.json({ success, image: updatedImage });
});

exports.deleteImage = asyncHandler(async (req, res) => {
  const imageId = Number(req.params.imageId);
  await deleteCarImage(imageId);
  res.status(204).end();
});