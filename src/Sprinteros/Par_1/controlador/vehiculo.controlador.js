const { tipoCombustible } = require('../../../config/prisma');
const { obtenerPlacaPorId, obtenerVIMPorId, obtenerMarcaPorId, obtenerModeloPorId, obtenerAnioPorId, obtenerVehiculoCompletoPorId, obtenerCaracteristicasPorId, obtenerCaracteristicasAdicionalesPorId, actualizarVehiculoPorId, actualizarCaracteristicasPorId,actualizarCaracteristicasAdicionalesPorId, eliminarVehiculoPorId } = require('../modelo/vehiculo.modelo');

const obtenerPlaca = async (req, res) => {
  try {
    const id = req.params.id;
    const placa = await obtenerPlacaPorId(id);

    if (!placa) {
      return res.status(404).json({ mensaje: 'Vehículo no encontrado' });
    }

    res.json(placa);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error del servidor', error: error.message });
  }
};
// Obtener el VIM por ID
const obtenerVIM = async (req, res) => {
  try {
    const id = req.params.id;
    const vim = await obtenerVIMPorId(id);

    if (!vim) {
      return res.status(404).json({ mensaje: 'Vehículo no encontrado' });
    }

    res.json(vim);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error del servidor', error: error.message });
  }
};
// Obtener la marca por ID
const obtenerMarca = async (req, res) => {
  try {
    const id = req.params.id;
    const marca = await obtenerMarcaPorId(id);

    if (!marca) {
      return res.status(404).json({ mensaje: 'Vehículo no encontrado' });
    }

    res.json(marca);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error del servidor', error: error.message });
  }
};

// Controlador para obtener el modelo
const obtenerModelo = async (req, res) => {
  try {
    const id = req.params.id;
    const modelo = await obtenerModeloPorId(id);

    if (!modelo) {
      return res.status(404).json({ mensaje: 'Vehículo no encontrado' });
    }

    res.json(modelo);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error del servidor', error: error.message });
  }
};

// Controlador para obtener el año
const obtenerAnio = async (req, res) => {
  try {
    const id = req.params.id;
    const ano = await obtenerAnioPorId(id);

    if (!ano) {
      return res.status(404).json({ mensaje: 'Vehículo no encontrado' });
    }

    res.json(ano);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error del servidor', error: error.message });
  }
};

const obtenerVehiculoCompleto = async (req, res) => {
  try {
    const id = req.params.id;
    const vehiculo = await obtenerVehiculoCompletoPorId(id);

    if (!vehiculo) {
      return res.status(404).json({ mensaje: 'Vehículo no encontrado' });
    }

    res.json(vehiculo);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error del servidor', error: error.message });
  }
};

const obtenerCaracteristicas = async (req, res) => {
  try {
    const id = req.params.id;
    const caracteristicas = await obtenerCaracteristicasPorId(id);

    if (!caracteristicas) {
      return res.status(404).json({ mensaje: 'Características no encontradas' });
    }

    res.json(caracteristicas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error del servidor', error: error.message });
  }
};



const obtenerCaracteristicasAdicionales = async (req, res) => {
  try {
    const id = req.params.id;
    const adicionales = await obtenerCaracteristicasAdicionalesPorId(id);

    if (!adicionales || adicionales.length === 0) {
      return res.status(404).json({ mensaje: 'Características adicionales no encontradas' });
    }

    res.json({ caracteristicasAdicionales: adicionales });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error del servidor', error: error.message });
  }
};


const actualizarVehiculo = async (req, res) => {
  try {
    const id = req.params.id;
    const datosActualizados = req.body;

    // Llamar al modelo para actualizar el vehículo
    const carroActualizado = await actualizarVehiculoPorId(id, datosActualizados);

    // Responder con los campos específicos
    res.json({
      mensaje: 'Vehículo actualizado correctamente',
      vehiculo: {
        id: carroActualizado.id,
        vim: carroActualizado.vim,
        marca: carroActualizado.marca,
        modelo: carroActualizado.modelo,
        placa: carroActualizado.placa,
      },
    });
  } catch (error) {
    res.status(400).json({
      mensaje: 'Error al actualizar el vehículo',
      error: error.message,
    });
  }
};


const actualizarCaracteristicas = async (req, res) => {
  try {
    const id = req.params.id;
    const datosActualizados = req.body;

    // Llamar al modelo para actualizar las características
    const caracteristicasActualizadas = await actualizarCaracteristicasPorId(id, datosActualizados);

    res.json({
      mensaje: "Características del vehículo actualizadas correctamente",
      caracteristicas: {
        tipoCombustible: caracteristicasActualizadas.tipoCombustible, 
        asientos: caracteristicasActualizadas.asientos,
        puertas: caracteristicasActualizadas.puertas,
        transmicion: caracteristicasActualizadas.transmicion,
        soat: caracteristicasActualizadas.soat,
      },
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "Error al actualizar las características del vehículo",
      error: error.message,
    });
  }
};

const actualizarCaracteristicasAdicionales = async (req, res) => {
  try {
    const id = req.params.id; // ID del vehículo
    const nuevasCaracteristicasAdicionales = req.body.nuevasCaracteristicasAdicionales; // Array de IDs de características adicionales

    // Validar que se envíen las características adicionales
    if (!Array.isArray(nuevasCaracteristicasAdicionales) || nuevasCaracteristicasAdicionales.length === 0) {
      return res.status(400).json({
        mensaje: "Debe proporcionar al menos una característica adicional en un array",
      });
    }

    // Llamar al modelo para actualizar las características adicionales
    const resultado = await actualizarCaracteristicasAdicionalesPorId (id, nuevasCaracteristicasAdicionales);

    // Responder con las características adicionales actualizadas
    res.json(resultado);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar las características adicionales del vehículo",
      error: error.message,
    });
  }
};

//const { eliminarVehiculoPorId } = require('../modelo/vehiculo.modelo');

const eliminarVehiculo = async (req, res) => {
  try {
    const id = req.params.id; // Obtener el ID del vehículo desde los parámetros de la URL

    // Validar que el ID sea un número válido
    if (!id || isNaN(id)) {
      return res.status(400).json({
        mensaje: "El ID del vehículo es inválido",
      });
    }

    // Llamar al modelo para eliminar el vehículo
    const resultado = await eliminarVehiculoPorId(id);

    // Responder con el resultado
    res.json(resultado);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar el vehículo",
      error: error.message,
    });
  }
};



module.exports = { obtenerPlaca, obtenerVIM, obtenerMarca, obtenerModelo,obtenerAnio, obtenerVehiculoCompleto, obtenerCaracteristicas, obtenerCaracteristicasAdicionales, actualizarVehiculo, actualizarCaracteristicas, actualizarCaracteristicasAdicionales, eliminarVehiculo};
