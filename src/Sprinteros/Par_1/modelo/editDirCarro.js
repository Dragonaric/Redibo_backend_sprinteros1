const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const updateDireccionCarro = async (idCarro, provinciaId, calle, num_casa) => {
  // Buscar la dirección del carro
  const carro = await prisma.carro.findUnique({
    where: { id: parseInt(idCarro) }, //lo usa como entero
    select: { id_direccion: true }
  });

  if (!carro || !carro.id_direccion) {
    return false; // Carro no encontrado o sin dirección
  }

  // Actualizar la dirección
  const direccionActualizada = await prisma.direccion.update({
    where: { id: carro.id_direccion },
    data: {
      id_provincia: provinciaId,
      calle: calle,
      num_casa: num_casa
    }
  });

  return !!direccionActualizada; // se actualizó correctamente
};

module.exports = { updateDireccionCarro };
