// En segurosRoutes.js
const express = require('express');
const router = express.Router();
const { getSeguros } = require('../controllers/segurosController');

router.get('/seguros', getSeguros); // Esto responderá a /api/v3/seguros

module.exports = router;