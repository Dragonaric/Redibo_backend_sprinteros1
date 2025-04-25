const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getImagenesCarro = async (idCarro) => {
  return await prisma.imagen.findMany({
    where: { id_carro: idCarro },  
    select: {
      id: true,       // Obtén el ID de la imagen
      data: true,     // Obtén la imagen en formato bytea
      id_carro: true  
    },
  });
};

module.exports = {
  getImagenesCarro,
};