// backend/controllers/carController.js

const carService = require('../services/carService');

const asyncHandler = require('../utils/asyncHandler');

const getCars = asyncHandler(async (req, res) => {
  const { start = 0, limit = 10, hostId } = req.query;

  if (isNaN(Number(start)) || isNaN(Number(limit))) {
    return res.status(400).json({
      success: false,
      message: 'Parámetros de paginación inválidos'
    });
  }

  const { cars, total } = await carService.getCars({
    skip: Number(start),
    take: Number(limit),
    hostId: hostId ? Number(hostId) : undefined
  });

  res.status(200).json({
    success: true,
    data: cars,
    total
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

const getCarById = asyncHandler(async (req, res) => {
  const car = await carService.getCarById(Number(req.params.id));
  if (!car) {
    return res.status(404).json({
      success: false,
      message: 'Carro no encontrado'
    });
  }
  res.status(200).json({
    success: true,
    data: car
  });
});

const updateCar = asyncHandler(async (req, res) => {
  const carId = Number(req.params.id);
  const payload = req.body;

  if (Object.keys(payload).length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No hay datos para actualizar'
    });
  }

  const updated = await carService.updateCar(carId, payload);

  res.status(200).json({
    success: true,
    message: 'Carro actualizado exitosamente.',
    data: updated
  });
});

const deleteCar = asyncHandler(async (req, res) => {
  await carService.deleteCar(Number(req.params.id));
  res.status(200).json({
    success: true,
    message: 'Carro eliminado exitosamente.'
  });
});

module.exports = {
  getCars,
  createCar,
  getCarById,
  updateCar,
  deleteCar
};
