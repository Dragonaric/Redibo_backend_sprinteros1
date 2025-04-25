const express = require('express');
const multer = require('multer');
const imageController = require('../controllers/imageController');

const router = express.Router();
const upload = multer(); // Configuración básica de multer

// Si deseas que para obtener imágenes se llame así: GET /api/v2/images?carId=1
router.get('/', imageController.getImagesByCarId);

// O bien, si prefieres usar parámetros en la URL (por ejemplo, /api/v2/images/:carId)
// router.get('/:carId', imageController.getImagesByCarId);

// Rutas para crear, actualizar y eliminar imágenes:
router.post('/', upload.single('image'), imageController.createImage);
router.put('/:imageId', upload.single('image'), imageController.updateImage);
router.delete('/:imageId', imageController.deleteImage);

module.exports = router;