const multer = require('multer');

// Configuración de multer para manejar archivos en memoria
const upload = multer({
  limits: {
    fileSize: 2 * 1024 * 1024, // Tamaño máximo de 2MB
  },
  fileFilter: (req, file, cb) => {
    // Validar el tipo de archivo
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('El archivo debe ser una imagen válida.'));
    }
    cb(null, true);
  },
}).single('image'); // Nombre del campo esperado en la solicitud

/**
 * Middleware para validar imágenes antes de procesarlas.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @param {Function} next - Función para pasar al siguiente middleware.
 */
function validateImage(req, res, next) {
  upload(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        // Error relacionado con multer (por ejemplo, tamaño excedido)
        return res.status(400).json({ error: 'La imagen excede el tamaño máximo permitido de 2MB.' });
      }
      // Otros errores (por ejemplo, tipo de archivo no válido)
      return res.status(400).json({ error: err.message });
    }
    // Continuar al siguiente middleware si no hay errores
    next();
  });
}

module.exports = validateImage;