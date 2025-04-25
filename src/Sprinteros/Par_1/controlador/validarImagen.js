const { getImagenesCarro } = require('../modelo/filtroImagen');

const obtenerImagenesCarro = async (req, res) => {
  try {
    const idCarro = parseInt(req.params.idCarro);

    if (!idCarro) {
      return res.status(400).json({ error: 'El ID del carro es obligatorio' });
    }

    const imagenes = await getImagenesCarro(idCarro);

    if (imagenes.length === 0) {
      return res.status(404).json({ error: `No se encontraron imágenes para el carro con ID ${idCarro}` });
    }

    res.status(200).json(imagenes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  obtenerImagenesCarro,
};
