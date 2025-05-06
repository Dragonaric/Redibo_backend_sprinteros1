// backend/routes/imageRoutes.js

const express         = require('express');
const imageController = require('../controllers/imageController');
const validateImage   = require('../middlewares/validateImage');

const router = express.Router();

// GET  /api/images/:carId
router.get('/:carId', imageController.getImagesByCarId);

// POST /api/images/:carId
router.post('/:carId', validateImage, imageController.createImage);

// PUT  /api/images/:imageId
router.put('/:imageId', validateImage, imageController.updateImage);

// DELETE /api/images/:imageId
router.delete('/:imageId', imageController.deleteImage);

module.exports = router;
