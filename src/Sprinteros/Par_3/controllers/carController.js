const carService = require('../services/carService');
const asyncHandler = require('../utils/asyncHandler'); // Utilidad nueva para manejo de async/await

const getCars = asyncHandler(async (req, res) => {
    const { start = 0, limit = 10,hostId} = req.query;
    
    // Validación numérica estricta
    if (isNaN(start) || isNaN(limit)) {
        return res.status(400).json({
            success: false,
            message: 'Parámetros de paginación inválidos'
        });
    }

    const result = await carService.getCars({ 
        skip: parseInt(start, 10), 
        take: parseInt(limit, 10),
        hostId: hostId ? parseInt(hostId, 10) : undefined
    });
    
    res.status(200).json({
        success: true,
        data: result.cars,
        total: result.total
    });
});

const createCar = asyncHandler(async (req, res) => {
    const newCar = await carService.createCar(req.body);
    res.status(201).json({
        success: true,
        message: 'Carro creado exitosamente',
        data: newCar
    });
});

const getCarById = async (req, res, next) => {
    try {
        const { id } = req.params; // Extrae el ID de los parámetros de la URL
        const car = await carService.getCarById(Number(id)); // Convierte el ID a número y llama al servicio

        if (!car) {
            return res.status(404).json({ 
                success: false, 
                message: 'Carro no encontrado' 
            });
        }

        return res.status(200).json({ 
            success: true, 
            data: car 
        });
    } catch (error) {
        next(error); // Delegar el error al middleware de manejo de errores
    }
};

const updateCar = async (req, res) => {
    try {
        const { id } = req.params; // Extrae el ID de los parámetros de la URL
        const data = req.body; // Datos enviados en el cuerpo de la solicitud

        if (!id || !data) {
            return res.status(400).json({
                success: false,
                message: 'El ID del carro y los datos a actualizar son requeridos.',
            });
        }

        const updatedCar = await carService.updateCar(id, data); // Llama al servicio
        res.status(200).json({
            success: true,
            message: 'Carro actualizado exitosamente.',
            data: updatedCar,
        });
    } catch (error) {
        console.error('Error actualizando el carro:', error);
        res.status(500).json({
            success: false,
            message: 'Ocurrió un error al actualizar el carro.',
        });
    }
};

const deleteCar = async (req, res) => {
    try {
        const { id } = req.params; // Extrae el ID de los parámetros de la URL
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'El ID del carro es requerido.',
            });
        }

        await carService.deleteCar(id); // Llama al servicio
        res.status(200).json({
            success: true,
            message: 'Carro eliminado exitosamente.',
        });
    } catch (error) {
        console.error('Error eliminando el carro:', error);
        res.status(500).json({
            success: false,
            message: 'Ocurrió un error al eliminar el carro.',
        });
    }
};

module.exports = { getCars, createCar, getCarById, updateCar, deleteCar };