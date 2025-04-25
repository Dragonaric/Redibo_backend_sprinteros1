const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function obtenerCarrosPorMarca(marca) {
  try {
    const carros = await prisma.carro.findMany({
      where: {
        marca: marca, // Solo filtrar por marca
      },
      include: {
        direccion: true, // Incluye los detalles de la dirección
        usuario: true,   // Incluye los detalles del usuario
      },
    });

    return carros;
  } catch (error) {
    console.error("Error al obtener los carros:", error);
    throw error;
  }
}

async function main() {
  const marcaBuscada = "Toyota"; // Cambia esta marca por la que buscas
  const carros = await obtenerCarrosPorMarca(marcaBuscada);
  console.log(carros);
}

main()
  .catch(e => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
