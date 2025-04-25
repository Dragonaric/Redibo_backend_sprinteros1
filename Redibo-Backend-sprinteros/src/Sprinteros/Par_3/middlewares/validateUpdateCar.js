const { body, validationResult } = require('express-validator');
const prisma = require('../../../config/prisma');// Instancia única compartida
exports.validateUpdateCar = [
  // Validaciones opcionales
  body('nombre')
    .optional()
    .trim()
    .notEmpty().withMessage('Nombre es requerido')
    .isLength({ max: 50 }).withMessage('Máximo 50 caracteres'),

  body('modelo')
    .optional()
    .trim()
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage('Modelo debe ser un año válido'),

  body('vim')
    .optional()
    .trim()
    .matches(/^[A-HJ-NPR-Z0-9]{17}$/).withMessage('VIN inválido')
    .custom(async (value, { req }) => {
      const existingCar = await prisma.carro.findFirst({ 
        where: { 
          vim: value,
          NOT: { id: Number(req.params.id) } // Ignora el registro actual
        } 
      });
      if (existingCar) throw new Error('VIN ya registrado');
      return true;
    }),

  body('placa')
    .optional()
    .trim()
    .matches(/^\d{4}[A-Z]{3}$/).withMessage('Formato inválido')
    .custom((value) => {
      const numero = parseInt(value.substring(0, 4), 10);
      if (numero < 0 || numero > 6399) throw new Error('Número de placa inválido');
      return true;
    })
    .custom(async (value, { req }) => {
      const existingCar = await prisma.carro.findFirst({
        where: { 
          placa: value,
          NOT: { id: Number(req.params.id) } 
        }
      });
      if (existingCar) throw new Error('Placa ya registrada');
      return true;
    }),

  // Manejo de errores
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors: errors.array()
      });
    }
    next();
  }
];