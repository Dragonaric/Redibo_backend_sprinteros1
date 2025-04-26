const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

// Importamos las rutas de los módulos
const rutasPar1  = require('./Sprinteros/Par_1/controlador/rutas');
const rutasPar3  = require('./Sprinteros/Par_3/routes');
const carRoutes  = require('./Sprinteros/Par_2/routes/carRoutes');

const app    = express();
const prisma = new PrismaClient();

// Middlewares globales
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('dev'));

// CORS abierto: permite cualquier origen
app.use(cors());

// Ruta base para verificar que el servidor esté funcionando
app.get('/', (req, res) => res.send('Server is running'));

// Montaje de rutas
app.use('/api',    rutasPar1);
app.use('/api/v2', rutasPar3);
app.use('/api/v3', carRoutes);

// 404 unificado
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Ruta no encontrada' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Error interno del servidor' });
});

// Levantar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Cierre limpio de Prisma
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});
