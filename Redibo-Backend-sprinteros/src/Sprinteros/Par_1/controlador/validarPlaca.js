const { PrismaClient } = require('@prisma/client'); // Importa PrismaClient
const prisma = new PrismaClient(); // Inicializa PrismaClient

// 1. Función para validar el formato de la placa
function validarPlaca(placa) {
  const regex = /^[A-Z]{3}\d{3}$/; // 3 letras seguidas de 3 números
  return regex.test(placa);
}

// 2. Función para verificar si la placa ya existe en la base de datos
async function verificarPlacaExistente(placa) {
  const placaExistente = await prisma.carro.findUnique({
    where: { placa: placa },
  });
  return placaExistente !== null; // Retorna true si existe, false si no
}

// 3. Función principal para verificar la placa y su existencia
async function verificarYActualizarPlaca(idCarro, nuevaPlaca) {
  // 1. Validar el formato de la placa
  if (!validarPlaca(nuevaPlaca)) {
    console.log("El formato de la placa no es válido. Debe ser 3 letras seguidas de 3 números.");
    return;
  }

  // 2. Verificar si la placa ya existe en la base de datos
  const placaYaExiste = await verificarPlacaExistente(nuevaPlaca);
  if (placaYaExiste) {
    console.log("La placa ya está registrada en la base de datos.");
    return;
  }

  // 3. Si la placa es válida y no existe, se puede actualizar el carro
  const carroActualizado = await prisma.carro.update({
    where: { id: idCarro },
    data: { placa: nuevaPlaca },
  });

  console.log("Carro actualizado con éxito:", carroActualizado);
}


module.exports = { validarPlaca };