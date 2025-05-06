// backend/services/imageService.js

const cloudinary = require('../../config/cloudinary');
const { PrismaClient } = require('@prisma/client');
const { Readable } = require('stream');

const prisma = new PrismaClient();

/**
 * Sube una imagen a Cloudinary y crea un registro en BD.
 */
async function uploadCarImage(imageBuffer, carId) {
  if (!Buffer.isBuffer(imageBuffer)) throw new Error('Buffer inválido');
  if (!Number.isInteger(carId)) throw new Error('CarId inválido');

  const folder = `car-images/${carId}`;
  const uploadResult = await new Promise((res, rej) => {
    const stream = cloudinary.uploader.upload_stream({ folder, resource_type: 'image' },
      (err, result) => err ? rej(err) : res(result)
    );
    Readable.from(imageBuffer).pipe(stream);
  });

  let saved;
  try {
    saved = await prisma.imagen.create({
      data: {
        data:      uploadResult.secure_url,
        public_id: uploadResult.public_id,
        id_carro:  carId,
        width:     uploadResult.width,
        height:    uploadResult.height,
        format:    uploadResult.format,
      }
    });
  } catch (e) {
    await cloudinary.uploader.destroy(uploadResult.public_id);
    throw new Error('Error guardando imagen en BD');
  }

  return { success: true, data: saved };
}

/**
 * Reemplaza la imagen de ID dado:
 * 1. Sube nueva a Cloudinary
 * 2. Actualiza el registro en BD
 * 3. Elimina el asset antiguo
 */
async function updateCarImage(imageBuffer, imageId) {
  if (!Buffer.isBuffer(imageBuffer)) throw new Error('Buffer inválido');
  if (!Number.isInteger(imageId)) throw new Error('ImageId inválido');

  const existing = await prisma.imagen.findUnique({
    where: { id: imageId },
    select: { public_id: true, id_carro: true }
  });
  if (!existing) throw new Error('Imagen no encontrada');

  const folder = `car-images/${existing.id_carro}`;
  const uploadResult = await new Promise((res, rej) => {
    const stream = cloudinary.uploader.upload_stream({ folder, resource_type: 'image' },
      (err, result) => err ? rej(err) : res(result)
    );
    Readable.from(imageBuffer).pipe(stream);
  });

  const updated = await prisma.imagen.update({
    where: { id: imageId },
    data: {
      data:      uploadResult.secure_url,
      public_id: uploadResult.public_id,
      width:     uploadResult.width,
      height:    uploadResult.height,
      format:    uploadResult.format,
    }
  });

  await cloudinary.uploader.destroy(existing.public_id);
  return { success: true, data: updated };
}

/**
 * Obtiene imágenes de un carro (paginado).
 */
async function getCarImages(carId, { page = 1, pageSize = 20 } = {}) {
  if (!Number.isInteger(carId)) throw new Error('CarId inválido');
  const skip = (page - 1) * pageSize;
  const [ total, data ] = await Promise.all([
    prisma.imagen.count({ where: { id_carro: carId } }),
    prisma.imagen.findMany({
      where: { id_carro: carId },
      orderBy: { id: 'asc' },
      skip,
      take: pageSize,
    })
  ]);
  return { success: true, data, pagination: { total, page, pageSize, totalPages: Math.ceil(total/pageSize) } };
}

/**
 * Elimina imagen de Cloudinary y BD.
 */
async function deleteCarImage(imageId) {
  if (!Number.isInteger(imageId)) throw new Error('ImageId inválido');
  const img = await prisma.imagen.findUnique({
    where: { id: imageId },
    select: { public_id: true }
  });
  if (!img) throw new Error('Imagen no encontrada');

  await prisma.$transaction(async tx => {
    await cloudinary.uploader.destroy(img.public_id);
    await tx.imagen.delete({ where: { id: imageId } });
  });

  return { success: true };
}

module.exports = {
  uploadCarImage,
  updateCarImage,
  getCarImages,
  deleteCarImage,
};
