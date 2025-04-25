const { body, validationResult } = require('express-validator');
const prisma = require('../../../config/prisma');// Instancia única compartida
exports.validateCreateCar = [
  // Validación nombre
  body('nombre')
    .trim()
    .notEmpty().withMessage('Nombre es requerido')
    .isLength({ max: 50 }).withMessage('Máximo 50 caracteres'),

  // Validación modelo
  body('modelo')
    .trim()
    .notEmpty().withMessage('Modelo es requerido')
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage('Modelo debe ser un año válido'),

  // Validación VIN
  body('vim')
    .trim()
    .notEmpty().withMessage('VIN es requerido')
    .matches(/^[A-HJ-NPR-Z0-9]{17}$/).withMessage('VIN inválido (17 caracteres alfanuméricos)')
    .custom(async (value) => {
      const existingCar = await prisma.carro.findFirst({ where: { vim: value } });
      if (existingCar) throw new Error('VIN ya registrado');
      return true;
    }),

  // Validación placa boliviana
  body('placa')
    .trim()
    .notEmpty().withMessage('Placa es requerida')
    .matches(/^\d{4}[A-Z]{3}$/).withMessage('Formato inválido. Ej: 1234ABC')
    .custom((value) => {
      const numero = parseInt(value.substring(0, 4), 10);
      const letras = value.substring(4);
      
      if (numero < 0 || numero > 6399) {
        throw new Error('Número de placa debe estar entre 0000 y 6399');
      }
      
      if (!/^[A-Z]{3}$/.test(letras)) {
        throw new Error('Letras de placa inválidas');
      }
      
      return true;
    })
    .custom(async (value) => {
      const existingCar = await prisma.carro.findFirst({ where: { placa: value } });
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