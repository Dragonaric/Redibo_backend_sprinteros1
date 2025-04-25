// generate-token.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Carga las variables de entorno desde .env
dotenv.config();

// --- ¡CONFIGURACIÓN IMPORTANTE! ---

// 1. ID del Usuario para el Token:
//    Reemplaza el '1' con el ID de un usuario REAL que exista
//    en tu tabla 'Usuario' de la base de datos.
//    Tu controlador 'createCar' usa 'req.user.id'.
const userId = 1; // <--- CAMBIA ESTO por un ID de usuario válido en tu BD

// 2. Payload del Token:
//    Incluye la información que tu middleware 'authenticateUser'
//    espera poner en 'req.user'. Como mínimo necesita el 'id'.
//    Puedes añadir más datos si tu app los usa (ej: rol, email).
const payload = {
  id: userId
  // rol: 'propietario', // Ejemplo si usaras roles
  // email: 'usuario@ejemplo.com' // Ejemplo
};

// 3. Tu Secreto JWT:
//    Asegúrate de que 'process.env.JWT_SECRET' esté definido
//    correctamente en tu archivo .env
const secretKey = process.env.JWT_SECRET;

// 4. Opciones del Token (Opcional pero recomendado):
//    Define por cuánto tiempo será válido el token.
const options = {
  expiresIn: '1h' // Ej: válido por 1 hora. Puedes usar '1d' (1 día), '7d' (7 días), etc.
};

// --- Generación del Token ---

if (!secretKey) {
  console.error('Error: JWT_SECRET no está definida en tu archivo .env');
  process.exit(1);
}

try {
  const token = jwt.sign(payload, secretKey, options);
  console.log('--- TOKEN JWT GENERADO ---');
  console.log(token);
  console.log('--------------------------');
  console.log(`Token válido por: ${options.expiresIn}`);
  console.log(`Payload (contenido): ${JSON.stringify(payload)}`);
} catch (error) {
  console.error('Error al generar el token:', error);
}