const { body, validationResult } = require('express-validator');

const validateCarData = [
  // Validación de dirección
  body('direccion.pais').notEmpty().withMessage('El país es requerido'),
  body('direccion.departamento').notEmpty().withMessage('El departamento es requerido'),
  body('direccion.provincia').notEmpty().withMessage('La provincia es requerida'),
  body('direccion.calle').notEmpty().withMessage('La calle es requerida'),
  
  // Validación de datos principales
  body('datosPrincipales.vin').isLength({ min: 17, max: 17 }).withMessage('El VIN debe tener 17 caracteres'),
  body('datosPrincipales.anio').isInt({ min: 1900, max: new Date().getFullYear() }).withMessage('Año inválido'),
  body('datosPrincipales.marca').notEmpty().withMessage('La marca es requerida'),
  body('datosPrincipales.modelo').notEmpty().withMessage('El modelo es requerido'),
  body('datosPrincipales.placa').notEmpty().withMessage('La placa es requerida'),
  
  // Validación de características
  body('caracteristicas.combustible').notEmpty().withMessage('El combustible es requerido'),
  body('caracteristicas.asientos').isInt({ min: 1 }).withMessage('Número de asientos inválido'),
  body('caracteristicas.puertas').isInt({ min: 1 }).withMessage('Número de puertas inválido'),
  body('caracteristicas.transmision').isIn(['manual', 'automatico', 'semiautomatico']).withMessage('Tipo de transmisión inválido'),
  body('caracteristicas.seguro').isBoolean().withMessage('El seguro debe ser verdadero o falso'),
  
  // Validación de finalización
  body('finalizacion.imagenes').isArray({ min: 3 }).withMessage('Se requieren al menos 3 imágenes'),
  body('finalizacion.mantenimientos').isInt({ min: 0 }).withMessage('Número de mantenimientos inválido'),
  body('finalizacion.precioAlquiler').isFloat({ min: 1 }).withMessage('Precio inválido'),
  body('finalizacion.descripcion').optional().isLength({ max: 150 }).withMessage('La descripción no debe exceder 150 caracteres'),

  // Manejo de errores
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }
    next();
  }
];

module.exports = {
  validateCarData
};