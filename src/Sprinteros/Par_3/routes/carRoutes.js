const express = require('express');
const router = express.Router();

const carController = require('../controllers/carController');
const authenticateToken = require('../middlewares/authenticateToken'); // Middleware para autenticar el token
const fullCarController = require('../controllers/fullCarController'); // Importar el controlador para carros completos
const { validateCreateCar } = require('../middlewares/validateCreateCar');
const { validateUpdateCar } = require('../middlewares/validateUpdateCar');
const validateNewCarFull = require('../middlewares/validateNewCarFull'); // Importar el middleware de validación
const validateID = require('../middlewares/validateID');
const { generateDevToken } = require('../controllers/generateDevToken'); // Middleware para generar token de desarrollo
// En carRoutes.js, antes de definir las rutas

router.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});
if (process.env.NODE_ENV !== 'production') {
  router.get('/dev-token', generateDevToken);
}
// Middleware para validar ID en todas las rutas que usen :id
router.post('/full', authenticateToken, validateNewCarFull, fullCarController.createFullCarHandler);
router.param('id', validateID);

// Ruta base /api/v2/cars
router.route('/')
  .get(carController.getCars)
  .post(validateCreateCar, carController.createCar);

// Ruta para crear un carro completo con todas sus relaciones


// Rutas con ID /api/v2/cars/:id
router.route('/:id')
  .get(carController.getCarById)
  .put(validateUpdateCar, carController.updateCar)
  .delete(carController.deleteCar); // DELETE /api/v2/cars/1
  

module.exports = router;