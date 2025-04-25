const {
  getCarroConDireccion,
  getPaises,
  getCiudades,
  getProvincias,
} = require('../modelo/filtroCiudad');

// Obtener todos los países
const obtenerPaises = async (req, res) => {
  try {
    const paises = await getPaises();
    res.status(200).json(paises);
  } catch (error) {
    console.error('Error al obtener los países:', error);
    res.status(500).json({ error: 'Error al obtener los países' });
  }
};

// Obtener ciudades por ID de país
const obtenerCiudadesPorPais = async (req, res) => {
  try {
    const { idPais } = req.params;
    const ciudades = await getCiudades(parseInt(idPais));
    res.status(200).json(ciudades);
  } catch (error) {
    console.error('Error al obtener las ciudades:', error);
    res.status(500).json({ error: 'Error al obtener las ciudades' });
  }
};

// Obtener provincias por ID de ciudad
const obtenerProvinciasPorCiudad = async (req, res) => {
  try {
    const { idCiudad } = req.params;
    const provincias = await getProvincias(parseInt(idCiudad));
    res.status(200).json(provincias);
  } catch (error) {
    console.error('Error al obtener las provincias:', error);
    res.status(500).json({ error: 'Error al obtener las provincias' });
  }
};

// Obtener todos los datos del carro con respecto a la dirección
const obtenerCarroConDireccion = async (req, res) => {
  try {
    const { idCarro } = req.params;
    if (!idCarro || isNaN(idCarro)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const carro = await getCarroConDireccion(parseInt(idCarro));

    if (!carro || !carro.direccion) {
      return res.status(404).json({ error: 'Carro no encontrado o sin dirección asociada' });
    }

    const { provincia, calle, num_casa } = carro.direccion;
    const { ciudad } = provincia;
    const { pais } = ciudad;

    // Datos mapeados
    const result = {
      paisId: pais.id,
      paisNombre: pais.nombre,
      ciudadId: ciudad.id,
      ciudadNombre: ciudad.nombre,
      provinciaId: provincia.id,
      provinciaNombre: provincia.nombre,
      calle,
      num_casa
    };

    res.status(200).json(result);
  } catch (error) {
    console.error('Error al obtener datos del carro con dirección:', error);
    res.status(500).json({ error: 'Error al obtener datos del carro con dirección' });
  }
};

module.exports = {
  obtenerPaises,
  obtenerCiudadesPorPais,
  obtenerProvinciasPorCiudad,
  obtenerCarroConDireccion,
};
