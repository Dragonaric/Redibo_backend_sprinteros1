// countryController.js

const { PrismaClient } = require('@prisma/client');  // Asegúrate de tener @prisma/client instalado
const prisma = new PrismaClient();

// Obtener todos los países
exports.getCountries = async (req, res) => {
  try {
    const countries = await prisma.pais.findMany();
    res.json(countries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los países' });
  }
};

// Crear un nuevo país
exports.createCountry = async (req, res) => {
  try {
    const { name } = req.body; // Asume que el nombre del país viene en el cuerpo de la solicitud
    const newCountry = await prisma.country.create({
      data: { name },
    });
    res.status(201).json(newCountry);  // 201 Created
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el país' });
  }
};

// Obtener un país por ID
exports.getCountryById = async (req, res) => {
  try {
    const { id } = req.params; // El ID viene en los parámetros de la ruta
    const country = await prisma.country.findUnique({
      where: { id: parseInt(id) },  // Convertir el ID a entero
    });
    if (!country) {
      return res.status(404).json({ error: 'País no encontrado' }); // 404 Not Found
    }
    res.json(country);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el país' });
  }
};

// Actualizar un país existente
exports.updateCountry = async (req, res) => {
   try {
       const { id } = req.params;
       const { name } = req.body;

       const updatedCountry = await prisma.country.update({
           where: { id: parseInt(id) },
           data: { name },
       });

       res.json(updatedCountry);
   } catch (error) {
       console.error(error);
       res.status(500).json({ error: 'Error updating country' });
   }
};

// Eliminar un país
exports.deleteCountry = async (req, res) => {
  try {
      const { id } = req.params;

      await prisma.country.delete({
          where: { id: parseInt(id) },
      });

      res.status(204).send(); // 204 No Content - Recurso eliminado exitosamente
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error deleting country' });
  }
};