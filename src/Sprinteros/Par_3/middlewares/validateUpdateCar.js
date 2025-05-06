// backend/middlewares/validateUpdateCar.js

const { body, validationResult } = require('express-validator');

exports.validateUpdateCar = [
  // Num. de mantenimientos: entero >= 0
  body('num_mantenimientos')
    .optional()
    .isInt({ min: 0 })
    .withMessage('num_mantenimientos debe ser un entero ≥ 0'),

  // Precio por día: número con hasta 2 decimales y > 0
  body('precio_por_dia')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('precio_por_dia debe ser un número > 0'),

  // Descripción: opcional, máximo 500 caracteres
  body('descripcion')
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage('descripcion debe tener máximo 500 caracteres'),

  // Manejo de errores
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors: errors.array().map(err => ({
          field: err.param,
          message: err.msg
        }))
      });
    }
    next();
  }
];
