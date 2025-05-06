// backend/middlewares/validateNewCarFull.js

const Joi = require('joi');

/**

 * 
 *Esquema de validación para un objeto de seguro adicional.
 */
const seguroAdicionalSchema = Joi.object({
  // El frontend envía 'id' pero el backend espera 'seguroId'
  // Podríamos mapearlo en el controlador o ajustar el schema aquí.
  // Ajustaremos el schema para que coincida con lo que espera el servicio.
  // Si el frontend *absolutamente* debe enviar 'id', necesitarías mapearlo
  // en el controlador antes de pasarlo al DTO del servicio.
  // Asumiendo que podemos hacer que el frontend envíe 'seguroId' o que mapeamos:
  seguroId: Joi.number().integer().required().messages({
    'number.base': 'El ID del seguro adicional debe ser un número.',
    'number.integer': 'El ID del seguro adicional debe ser un entero.',
    'any.required': 'El ID del seguro adicional es requerido.',
  }),
  fechaInicio: Joi.date().iso().required().messages({
    'date.base': 'La fecha de inicio del seguro debe ser una fecha válida.',
    'date.format': 'La fecha de inicio del seguro debe estar en formato ISO (YYYY-MM-DD).',
    'any.required': 'La fecha de inicio del seguro es requerida.',
  }),
  // En el frontend, fechaFin es opcional, pero en el backend lo requerimos
  // si se envía el seguro. Joi puede manejar esto.
  // Si la lógica es que *puede* no tener fecha fin, ajusta la DB y el schema.
  // Asumiendo que si se añade un seguro, debe tener fecha de fin:
  fechaFin: Joi.date().iso().required().greater(Joi.ref('fechaInicio')).messages({
    'date.base': 'La fecha de fin del seguro debe ser una fecha válida.',
    'date.format': 'La fecha de fin del seguro debe estar en formato ISO (YYYY-MM-DD).',
    'any.required': 'La fecha de fin del seguro es requerida.',
    'date.greater': 'La fecha de fin del seguro debe ser posterior a la fecha de inicio.',
  }),
  // Los campos nombre, tipoSeguro, empresa vienen del frontend pero no se usan
  // directamente para la creación en el backend (se usan solo los IDs y fechas).
  // No los validamos aquí a menos que sean necesarios para algo más.
});


const newCarSchema = Joi.object({
  id_provincia:           Joi.number().integer().required(),
  calle:                  Joi.string().required(),
  zona:                   Joi.string().required(),
  num_casa:               Joi.string().allow(null, ''),

  vim:                    Joi.string().required(),
  año:                    Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
  marca:                  Joi.string().required(),
  modelo:                 Joi.string().required(),
  placa:                  Joi.string().required(),

  combustibleIds:         Joi.array().items(Joi.number().integer()).min(1).required(),
  extraIds:               Joi.array().items(Joi.number().integer()).min(0).required(),

  asientos:               Joi.number().integer().min(1).required(),
  puertas:                Joi.number().integer().min(1).required(),
  soat:                   Joi.boolean().required(),
  transmicion:            Joi.string().valid('manual', 'automatica').required(),
  precio_por_dia:         Joi.number().precision(2).required(),
  num_mantenimientos:     Joi.number().integer().min(0).required(),

  estado:                 Joi.string().required(),
  descripcion:            Joi.string().allow(null, ''),
});

/**
 * Middleware para validar el cuerpo de la petición
 * antes de crear un carro completo.
 */
function validateNewCarFull(req, res, next) {
  const { error } = newCarSchema.validate(req.body, {
    abortEarly: false,
    convert:    true,
  });

  if (error) {
    return res.status(400).json({
      success: false,
      errors: error.details.map(detail => ({
        field:   detail.path.join('.'),
        message: detail.message,
      })),
    });
  }

  next();
}

module.exports = validateNewCarFull;
