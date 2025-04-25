const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Obtener todas las ciudades
exports.getCities = async (req, res) => {
  try {
    const cities = await prisma.ciudad.findMany({
      include: { // Incluye el país asociado a cada ciudad
        pais: true,
      },
    });
    res.json(cities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las ciudades' });
  }
};

// Crear una nueva ciudad
exports.createCity = async (req, res) => {
  try {
    const { nombre, id_pais } = req.body; // Asume que nombre e id_pais vienen en el cuerpo
    if (!nombre || !id_pais) {
      return res.status(400).json({ error: 'Nombre e id_pais son requeridos' });
    }

    const newCity = await prisma.ciudad.create({
      data: {
        nombre,
        pais: {
          connect: { id: parseInt(id_pais) },  // Conecta la ciudad al país
        },
      },
      include: {
        pais: true, // Incluye el país asociado en la respuesta
      },
    });
    res.status(201).json(newCity); // 201 Created
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la ciudad' });
  }
};

// Obtener una ciudad por ID
exports.getCityById = async (req, res) => {
  try {
    const { id } = req.params;
    const city = await prisma.ciudad.findUnique({
      where: { id: parseInt(id) },
      include: {
        pais: true, // Incluye el país asociado
        usuarios: true,  // Incluye los usuarios que viven en esta ciudad
        provincias: true //Incluye las provincias asociadas a esa ciudad
      },
    });
    if (!city) {
      return res.status(404).json({ error: 'Ciudad no encontrada' });
    }
    res.json(city);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la ciudad' });
  }
};

// Actualizar una ciudad existente
exports.updateCity = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, id_pais } = req.body;
    if (!nombre || !id_pais) {
      return res.status(400).json({ error: 'Nombre e id_pais son requeridos' });
    }

    const updatedCity = await prisma.ciudad.update({
      where: { id: parseInt(id) },
      data: {
        nombre,
        pais: {
          connect: { id: parseInt(id_pais) },
        },
      },
      include: {
        pais: true,
      },
    });
    res.json(updatedCity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar la ciudad' });
  }
};

// Eliminar una ciudad
exports.deleteCity = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.ciudad.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send(); // 204 No Content
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la ciudad' });
  }
};

// Obtener ciudades por ID de país (adicional, si es necesario)
exports.getCitiesByCountryId = async (req, res) => {
  try {
    const { countryId } = req.params;
    const cities = await prisma.ciudad.findMany({
      where: { id_pais: parseInt(countryId) },
      
    });
    res.json(cities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las ciudades por ID de país' });
  }
};