const express = require('express');
const router = express.Router();

const authenticateToken = require('../middlewares/authenticateToken');
const validateID = require('../middlewares/validateID');
const { validateCreateCar } = require('../middlewares/validateCreateCar');
const { validateUpdateCar } = require('../middlewares/validateUpdateCar');
const validateNewCarFull = require('../middlewares/validateNewCarFull');
const carController = require('../controllers/carController');
const fullCarController = require('../controllers/fullCarController');
const { generateDevToken } = require('../controllers/generateDevToken');

// Middleware para deshabilitar el almacenamiento en caché
router.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

// Ruta para generar un token de desarrollo (solo en entornos no productivos)
if (process.env.NODE_ENV !== 'production') {
  router.get('/dev-token', generateDevToken);
}

// Ruta para crear un carro completo (sin imágenes)
router.post(
  '/full',
  authenticateToken, // Middleware para autenticar el token
  validateNewCarFull, // Middleware para validar los datos del carro completo
  fullCarController.createFullCarHandler // Controlador para manejar la creación
);

// Middleware para validar el parámetro "id" en las rutas
router.param('id', validateID);

// Rutas estándar CRUD para carros
router
  .route('/')
  .get(authenticateToken, carController.getCars) // Obtener lista de carros
  .post(authenticateToken, validateCreateCar, carController.createCar); // Crear un carro

router
  .route('/:id')
  .get(authenticateToken, carController.getCarById) // Obtener un carro por ID
  .put(authenticateToken, validateUpdateCar, carController.updateCar) // Actualizar un carro
  .delete(authenticateToken, carController.deleteCar); // Eliminar un carro

// Middleware global para manejar errores en las rutas
router.use((err, res) => {
  console.error('Error en carRoutes:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
  });
});

module.exports = router;