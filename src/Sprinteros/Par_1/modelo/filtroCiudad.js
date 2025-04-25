const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Obtener todos los países
const getPaises = async () => {
  return await prisma.pais.findMany({
    select: { id: true, nombre: true },
  });
};

// Obtener ciudades por ID de país
const getCiudades = async (idPais) => {
  return await prisma.ciudad.findMany({
    where: { id_pais: idPais },
    select: { id: true, nombre: true },
  });
};

// Obtener provincias por ID de ciudad
const getProvincias = async (idCiudad) => {
  return await prisma.provincia.findMany({
    where: { id_ciudad: idCiudad },
    select: { id: true, nombre: true },
  });
};

// Obtener todos los datos del carro con respecto a la dirección (para preseleccionar)
const getCarroConDireccion = async (idCarro) => {
  const carro = await prisma.carro.findUnique({
    where: { id: idCarro },
    select: {
      id: true,
      direccion: {
        select: {
          id: true,
          calle: true,
          num_casa: true,
          provincia: {
            select: {
              id: true,
              nombre: true,
              ciudad: {
                select: {
                  id: true,
                  nombre: true,
                  pais: {
                    select: {
                      id: true,
                      nombre: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!carro || !carro.direccion) {
    throw new Error(`No se encontró un carro con dirección asociada al ID ${idCarro}`);
  }

  return carro;
};

module.exports = {
  getPaises,
  getCiudades,
  getProvincias,
  getCarroConDireccion,
};
