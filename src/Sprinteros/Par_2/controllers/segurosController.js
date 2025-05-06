const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getSeguros = async (req, res) => {
  try {
    const seguros = await prisma.seguro.findMany({
      select: {
        id: true,
        nombre: true,
        tipoSeguro: true,
        empresa: true
      }
    });
    
    res.status(200).json({
      success: true,
      data: seguros
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener seguros",
      error: error.message
    });
  }
};