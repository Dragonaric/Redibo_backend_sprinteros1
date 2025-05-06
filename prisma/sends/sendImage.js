const fs = require('fs/promises');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { uploadCarImage } = require('../../src/Sprinteros/Par_3/services/imageService');

const prisma = new PrismaClient();

// Configuración:
const IMAGES_PER_CAR = 3;
const BASE_IMAGES_DIR = path.join(__dirname, 'imagen', 'idhost_1');

async function verifyDirectory(dir) {
  try {
    await fs.access(dir);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  // Verificación inicial del directorio base
  const baseExists = await verifyDirectory(BASE_IMAGES_DIR);
  if (!baseExists) {
    console.error(`❌ Error: El directorio base no existe: ${BASE_IMAGES_DIR}`);
    return;
  }

  console.log(`📁 Usando directorio base: ${BASE_IMAGES_DIR}`);
  
  await prisma.$connect();

  const carros = [
    { id: 1, placa: '1234ABC' },
    { id: 5, placa: '1234ABC1' },
    { id: 6, placa: '5678DEF2' },
    { id: 7, placa: '3456GHI3' },
    { id: 8, placa: '6399JKL4' },
  ];

  for (const { id: carId, placa } of carros) {
    try {
      // Verificar imágenes existentes
      const existing = await prisma.imagen.count({ where: { id_carro: carId } });
      const needed = IMAGES_PER_CAR;

      if (needed <= 0) {
        console.log(`✔ Carro ${placa} (ID ${carId}) ya tiene ${existing}/${IMAGES_PER_CAR} imágenes.`);
        continue;
      }

      const cardDir = path.join(BASE_IMAGES_DIR, `idcard_${carId}`);
      
      if (!await verifyDirectory(cardDir)) {
        console.warn(`⚠ No existe carpeta para carro ${placa}: ${cardDir}`);
        continue;
      }

      // Leer y procesar archivos
      const files = await fs.readdir(cardDir);
      const imageFiles = files
        .filter(f => /^imagen[1-3]\.(jpe?g|png)$/i.test(f))
        .sort((a, b) => {
          const numA = parseInt(a.match(/\d+/)[0]);
          const numB = parseInt(b.match(/\d+/)[0]);
          return numA - numB;
        });

      console.log(`📸 Encontradas ${imageFiles.length} imágenes para carro ${placa}`);

      for (let i = 0; i < Math.min(IMAGES_PER_CAR, imageFiles.length); i++) {
        const filename = imageFiles[i];
        const filepath = path.join(cardDir, filename);
        
        try {
          console.log(`⏳ Procesando ${filename} para carro ${placa}...`);
          const buffer = await fs.readFile(filepath);
          const { success, data: savedImage } = await uploadCarImage(buffer, carId);
          
          if (success) {
            console.log(`✅ Subida exitosa: ${filename} -> ${savedImage.data}`);
          } else {
            console.warn(`❌ Falló la subida de ${filename}`);
          }
        } catch (err) {
          console.error(`❌ Error procesando ${filename}: ${err.message}`);
        }
      }
    } catch (err) {
      console.error(`❌ Error general para carro ${placa}: ${err.message}`);
    }
  }
}

main()
  .catch(err => console.error('Error en el script:', err))
  .finally(() => prisma.$disconnect());