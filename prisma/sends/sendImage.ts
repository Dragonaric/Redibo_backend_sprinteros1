import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Variables necesarias
  const carrosHost1 = [
    { id: 1, placa: '1234ABC' },
    { id: 5, placa: '1234ABC1' },
    { id: 6, placa: '5678DEF2' },
    { id: 7, placa: '3456GHI3' },
    { id: 8, placa: '6399JKL4' },
  ];
  const imagenesPorCarro = 3; // Número máximo de imágenes por carro
  const maxSize = 2 * 1024 * 1024; // 2MB en bytes

  // Definición de la ruta base de imágenes usando una ruta relativa dentro del repositorio
  const imagenesBasePath = path.join(__dirname, '..', 'sends', 'imagen');

  for (const [index, carro] of carrosHost1.entries()) {
    try {
      // Verificar imágenes existentes en la base de datos
      const imagenesExistentes = await prisma.imagen.findMany({
        where: { id_carro: carro.id },
      });

      if (imagenesExistentes.length >= imagenesPorCarro) {
        console.log(`El carro ${carro.placa} ya tiene imágenes.`);
        continue;
      }

      // Procesar imágenes para el carro
      for (let i = 1; i <= imagenesPorCarro; i++) {
        // Construir la ruta usando la estructura: idhost_1/idcard_<carro.id>/imagen<i>.jpg
        const imagePath = path.join(imagenesBasePath, 'idhost_1', `idcard_${carro.id}`, `imagen${i}.jpg`);

        try {
          // Verificar si la imagen existe y obtener sus estadísticas
          const stats = await fs.stat(imagePath);
          let imageBuffer = await fs.readFile(imagePath);

          // Si la imagen supera los 2MB, proceder a comprimir/redimensionar
          if (stats.size > maxSize) {
            console.log(`La imagen ${imagePath} supera los 2MB. Comprimiendo...`);
            imageBuffer = await sharp(imageBuffer)
              .resize({ width: 1920, withoutEnlargement: true })
              .jpeg({ quality: 80 })
              .toBuffer();
          }

          // Crear el registro de la imagen en la base de datos
          await prisma.imagen.create({
            data: {
              data: imageBuffer,
              id_carro: carro.id,
            },
          });

          console.log(`Imagen ${i} añadida para carro ${carro.placa}`);
        } catch (error: any) {
          console.warn(`No se pudo cargar imagen ${imagePath}: ${error.message}`);
        }
      }
    } catch (error: any) {
      console.error(`Error procesando el carro ${carro.placa}: ${error.message}`);
    }
  }
}

// Ejecutar la función principal
main()
  .then(() => {
    console.log('Proceso completado.');
    prisma.$disconnect(); // Cerrar la conexión con Prisma
  })
  .catch((error) => {
    console.error('Error al procesar las imágenes:', error);
    prisma.$disconnect(); // Cerrar la conexión con Prisma en caso de error
  });
