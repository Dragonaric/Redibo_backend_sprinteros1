const { updateDireccionCarro } = require('../modelo/editDirCarro');

const editarDireccionCarro = async (req, res) => {
  try {
    const id_carro = req.params.idCarro;
    const { id_provincia, calle, num_casa } = req.body;

    // Validar campos obligatorios
    if (!id_provincia || !calle || !num_casa) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Validar que num_casa solo contenga números
    if (!/^\d+$/.test(num_casa)) {
      return res.status(400).json({ error: 'El número de casa debe contener solo dígitos numéricos' });
    }

    // Validar que calle contenga solo letras, números, espacios y puntos
    if (!/^[\w\s.]+$/.test(calle)) {
      return res.status(400).json({ error: 'La calle solo puede contener letras, números, espacios y puntos' });
    }

    // Llamada del modelo
    const direccionActualizada = await updateDireccionCarro(id_carro, id_provincia, calle, num_casa);

    if (!direccionActualizada) {
      return res.status(404).json({ error: 'Carro o dirección no encontrada o no se pudo actualizar' });
    }

    return res.status(200).json({ message: 'Dirección actualizada con éxito' });

  } catch (error) {
    console.error('Error al actualizar la dirección:', error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { editarDireccionCarro };
