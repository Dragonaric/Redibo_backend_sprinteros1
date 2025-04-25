const express = require('express');
const router = express.Router();
const countryController = require('../controllers/countryController');
const cityController = require('../controllers/cityController');
const provinceController = require('../controllers/provinceController');

// Ruta base /api/v2/direc

// Rutas para Países (Countries)
router.route('/paises')
.get(countryController.getCountries)   // GET /api/v2/direc/countries
.post(countryController.createCountry);  // POST /api/v2/direc/countries

router.route('/paises/:id')
.get(countryController.getCountryById)  // GET /api/v2/direc/countries/:id
.put(countryController.updateCountry)    // PUT /api/v2/direc/countries/:id
.delete(countryController.deleteCountry); // DELETE /api/v2/direc/countries/:id

// Rutas para Ciudades (Cities)
router.route('/cities')
.get(cityController.getCities)       // GET /api/v2/direc/cities
.post(cityController.createCity);      // POST /api/v2/direc/cities

router.route('/cities/:id')
.get(cityController.getCityById)       // GET /api/v2/direc/cities/:id
.put(cityController.updateCity)        // PUT /api/v2/direc/cities/:id
.delete(cityController.deleteCity);     // DELETE /api/v2/direc/cities/:id

router.get('/paises/:countryId/cities', cityController.getCitiesByCountryId);

router.route('/provinces')
  .get(provinceController.getProvinces)    // GET /api/v2/direc/provinces
  .post(provinceController.createProvince);  // POST /api/v2/direc/provinces

router.route('/provinces/:id')
  .get(provinceController.getProvinceById)  // GET /api/v2/direc/provinces/:id
  .put(provinceController.updateProvince)    // PUT /api/v2/direc/provinces/:id
  .delete(provinceController.deleteProvince); // DELETE /api/v2/direc/provinces/:id

router.get('/cities/:cityId/provinces', provinceController.getProvincesByCityId);

module.exports = router;