const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Obtener todas las provincias
exports.getProvinces = async (req, res) => {
  try {
    const provinces = await prisma.provincia.findMany({
      include: { // Incluye la ciudad asociada a cada provincia
        ciudad: true,
      },
    });
    res.json(provinces);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las provincias' });
  }
};

// Crear una nueva provincia
exports.createProvince = async (req, res) => {
  try {
    const { nombre, id_ciudad } = req.body; // Asume que nombre e id_ciudad vienen en el cuerpo
    if (!nombre || !id_ciudad) {
      return res.status(400).json({ error: 'Nombre e id_ciudad son requeridos' });
    }

    const newProvince = await prisma.provincia.create({
      data: {
        nombre,
        ciudad: {
          connect: { id: parseInt(id_ciudad) },  // Conecta la provincia a la ciudad
        },
      },
      include: {
        ciudad: true, // Incluye la ciudad asociada en la respuesta
      },
    });
    res.status(201).json(newProvince); // 201 Created
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la provincia' });
  }
};

// Obtener una provincia por ID
exports.getProvinceById = async (req, res) => {
  try {
    const { id } = req.params;
    const province = await prisma.provincia.findUnique({
      where: { id: parseInt(id) },
      include: {
        ciudad: true, // Incluye la ciudad asociada
      },
    });
    if (!province) {
      return res.status(404).json({ error: 'Provincia no encontrada' });
    }
    res.json(province);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la provincia' });
  }
};

// Actualizar una provincia existente
exports.updateProvince = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, id_ciudad } = req.body;
    if (!nombre || !id_ciudad) {
      return res.status(400).json({ error: 'Nombre e id_ciudad son requeridos' });
    }

    const updatedProvince = await prisma.provincia.update({
      where: { id: parseInt(id) },
      data: {
        nombre,
        ciudad: {
          connect: { id: parseInt(id_ciudad) },
        },
      },
      include: {
        ciudad: true,
      },
    });
    res.json(updatedProvince);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar la provincia' });
  }
};

// Eliminar una provincia
exports.deleteProvince = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.provincia.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send(); // 204 No Content
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la provincia' });
  }
};

// Obtener provincias por ID de ciudad (ya implementado, lo revisamos)
exports.getProvincesByCityId = async (req, res) => {
  try {
    const { cityId } = req.params;
    const provinces = await prisma.provincia.findMany({
      where: {
        id_ciudad: parseInt(cityId),
      },
    });
    res.json(provinces);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las provincias por ID de ciudad' });
  }
};