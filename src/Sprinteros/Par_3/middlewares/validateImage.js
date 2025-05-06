// backend/middlewares/validateImage.js

const multer = require('multer');
const storage = multer.memoryStorage();

// límite ejemplo: 5 MB, solo imágenes
const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Sólo se permiten archivos de imagen'));
    }
    cb(null, true);
  }
});

module.exports = [
  upload.single('file'),
  (err, req, res, next) => {
    // manejar errores de Multer
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Archivo requerido' });
    }
    next();
  }
];
