const { PrismaClient } = require('@prisma/client');
const readline = require('readline'); // Importar el módulo readline
const prisma = new PrismaClient();

class ControlVin {
  // Validar el formato del VIN (17 caracteres alfanuméricos)
  static validarFormatoVin(vin) {
    const regex = /^[A-HJ-NPR-Z0-9]{17}$/; // Excluye I, O, Q para evitar confusiones
    return regex.test(vin);
  }

  // Verificar si el VIN ya existe en la base de datos
  static async verificarVinExistente(vin) {
    const vinExistente = await prisma.carro.findUnique({
      where: { vin: vin },
    });
    return vinExistente !== null; // Retorna true si existe, false si no
  }

  // Método principal para verificar y actualizar el VIN
  static async verificarYActualizarVin(idCarro, nuevoVin) {
    // 1. Validar el formato del VIN
    if (!this.validarFormatoVin(nuevoVin)) {
      console.log("El formato del VIN no es válido. Debe tener 17 caracteres alfanuméricos.");
      return;
    }

    // 2. Verificar si el VIN ya existe en la base de datos
    const vinYaExiste = await this.verificarVinExistente(nuevoVin);
    if (vinYaExiste) {
      console.log("El VIN ya está registrado en la base de datos.");
      return;
    }

    // 3. Si el VIN es válido y no existe, se puede actualizar el carro
    const carroActualizado = await prisma.carro.update({
      where: { id: idCarro },
      data: { vin: nuevoVin },
    });

    console.log("Carro actualizado con éxito:", carroActualizado);
  }
}

// Configurar readline para capturar datos desde la terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Pedir datos al usuario
rl.question("Ingrese el ID del carro: ", (idCarro) => {
  rl.question("Ingrese el nuevo VIN: ", async (nuevoVin) => {
    // Llamar al método para verificar y actualizar el VIN
    await ControlVin.verificarYActualizarVin(parseInt(idCarro), nuevoVin);

    // Cerrar la interfaz de readline
    rl.close();
  });
});

module.exports = ControlVin;