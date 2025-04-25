const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser'); // Mantén solo esta línea
const { PrismaClient } = require('@prisma/client');

// Importamos las rutas de los módulos
const rutasPar1 = require('./sprinteros/Par_1/controlador/rutas');
const rutasPar3 = require('./sprinteros/Par_3/routes');
const carRoutes = require('./Sprinteros/Par_2/routes/carRoutes');

const app = express();
const prisma = new PrismaClient();

// Middlewares globales
app.use(express.json({ limit: '10mb' })); // Procesar JSON con límite de 10MB
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Procesar URL-encoded
app.use(bodyParser.json({ limit: '50mb' })); // Procesar JSON con límite de 50MB
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' })); // Procesar URL-encoded con límite de 50MB
app.use(morgan('dev')); // Logger de solicitudes

// Configuración de CORS
const allowedOrigins = ['http://localhost:3000', 'http://localhost:4000'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origen no permitido por CORS'));
    }
  },
}));

// Ruta base para verificar que el servidor esté funcionando
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Montar las rutas de los módulos
app.use('/api', rutasPar1); // Rutas para Par_1
app.use('/api/v2', rutasPar3); // Rutas para Par_3
app.use('/api/v3', carRoutes); // Rutas para Par_2

// Middleware para manejar rutas no definidas
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
  });
});

// Middleware global para manejar errores no capturados
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Validar variables de entorno antes de iniciar el servidor
const PORT = process.env.PORT || 4000;
if (!PORT) {
  console.error('Error: La variable de entorno PORT no está configurada.');
  process.exit(1);
}

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Desconectar Prisma al cerrar el servidor
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});