const { validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const fullCarService = require('../services/fullCarService');

/**
 * Controlador para crear un carro completo con todas sus relaciones y datos asociados.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 */
const createFullCarHandler = asyncHandler(async (req, res) => {
  // 1) Extraer id_usuario_rol de req.user
  const id_usuario_rol = req.user?.id_usuario_rol;

  if (!id_usuario_rol) {
    return res.status(403).json({ success: false, message: 'No tienes permiso para realizar esta acción.' });
  }

  // 2) Validación Joi
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  // 3) Desestructurar del body
  const {
    id_provincia, calle, zona, num_casa,
    vim, año, marca, modelo, placa,
    asientos, puertas, soat,
    combustibleIds, extraIds, imagesBase64,
    precio_por_dia, num_mantenimientos,
    transmicion, estado, descripcion,
  } = req.body;

  // 4) Construir DTO
  const dto = {
    direccion: { id_provincia, calle, zona, num_casa },
    carro: {
      vim,
      año,
      marca,
      modelo,
      placa,
      id_usuario_rol, // Usar el id_usuario_rol del token
      asientos,
      puertas,
      soat,
      precio_por_dia,
      num_mantenimientos,
      transmicion,
      estado,
      descripcion,
    },
    imagesBase64,
    combustibles: combustibleIds,
    caracteristicas: extraIds,
  };

  // 5) Llamar al servicio
  const result = await fullCarService.createFullCar(dto);
  res.status(201).json({ success: true, data: result });
});

module.exports = { createFullCarHandler };
