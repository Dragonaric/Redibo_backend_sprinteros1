//RUTA
const express = require('express');
const { 
    obtenerCiudadesPorPais, 
    obtenerProvinciasPorCiudad, 
    obtenerPaises, 
    obtenerCarroConDireccion // Importa la función para manejar la nueva ruta
} = require('./controlCiudad');
const { validarPlaca } = require('./validarPlaca');
const {
    obtenerPlaca,
    obtenerVIM,
    obtenerMarca,
    obtenerModelo,
    obtenerAnio,
    obtenerVehiculoCompleto, obtenerCaracteristicas // 👈 nuevo import
} = require('./vehiculo.controlador');
const {  obtenerCaracteristicasAdicionales} = require('./vehiculo.controlador');
const { obtenerImagenesCarro } = require('./validarImagen');
const { editarDireccionCarro } = require('./editarDirCarro'); 

const router = express.Router();

const { actualizarVehiculo,
        actualizarCaracteristicas, 
        actualizarCaracteristicasAdicionales,
        eliminarVehiculo
    } = require('./vehiculo.controlador');


// Rutas existentes
router.get('/ciudades/:idPais', obtenerCiudadesPorPais);
router.get('/provincias/:idCiudad', obtenerProvinciasPorCiudad);
router.get('/paises', obtenerPaises);
router.get('/carro/direccion/:idCarro', obtenerCarroConDireccion);
router.get('/carro/imagenes/:idCarro', obtenerImagenesCarro);

// Rutas relacionadas con vehículos
router.get('/vehiculo/:id/placa', obtenerPlaca);
router.get('/vehiculo/:id/vim', obtenerVIM);
router.get('/vehiculo/:id/marca', obtenerMarca);
router.get('/vehiculo/:id/modelo', obtenerModelo);
router.get('/vehiculo/:id/anio', obtenerAnio);
router.post('/validar/:id/placa', validarPlaca);
router.get('/vehiculo/:id/completo', obtenerVehiculoCompleto);
router.get('/vehiculo/:id/caracteristicas', obtenerCaracteristicas);
router.get('/vehiculo/:id/caracteristicas-adicionales', obtenerCaracteristicasAdicionales);


//PUT
router.put('/vehiculo/:id', actualizarVehiculo);
router.put("/vehiculo/:id/caracteristicas", actualizarCaracteristicas);
router.put('/carro/direccion/:idCarro', editarDireccionCarro);
router.put("/vehiculo/:id/caracteristicas-adicionales", actualizarCaracteristicasAdicionales);

router.delete('/vehiculo/:id', eliminarVehiculo);
module.exports = router;
