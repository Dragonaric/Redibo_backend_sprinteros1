const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

// Importamos las rutas de los módulos
const rutasPar1 = require('./Sprinteros/Par_1/controlador/rutas');
const rutasPar3 = require('./Sprinteros/Par_3/routes');
const carRoutes = require('./Sprinteros/Par_2/routes/carRoutes');

const app = express();
const prisma = new PrismaClient();

// Middlewares globales
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('dev')); 

// Configuración de CORS
// Reemplaza todo el bloque de allowedOrigins + origin callback por:


const allowedOrigins = [
  'https://redibo-backend-sprinteros.onrender.com', // URL de tu frontend
  'https://redibo-backend-sprinteros1.onrender.com'
];

app.use(cors({
  origin: (origin, callback) => {
    // Permitir solicitudes sin origen (como mobile apps o curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origen no permitido por CORS'));
    }
  },
  credentials: true // Si usas cookies o autenticación
}));

// Ruta base para verificar que el servidor esté funcionando
app.get('/', (req, res) => res.send('Server is running'));
app.use('/api', rutasPar1);
app.use('/api/v2', rutasPar3);
app.use('/api/v3', carRoutes);

// Middleware para manejar rutas no definidas
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
  });
});

// Middleware global para manejar errores no capturados
app.use((req, res) => res.status(404).json({ success: false, message: 'Ruta no encontrada' }));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Error interno del servidor' });
});

// Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Cierre limpio de Prisma
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});