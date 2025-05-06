// src/Par_3/services/carInsuranceService.js (o la ruta que elijas)
const { Prisma } = require('@prisma/client'); // Asegúrate que prisma esté accesible
const { CarServiceError } = require('../errors/customErrors'); // Reutiliza o crea errores específicos si prefieres

/**
 * Vincula una lista de seguros adicionales a un carro existente dentro de una transacción.
 * @param {Prisma.TransactionClient} tx - El cliente de transacción de Prisma.
 * @param {number} carId - El ID del carro al que se vincularán los seguros.
 * @param {Array<{seguroId: number, fechaInicio: string, fechaFin: string}>} segurosData - Array con los datos de los seguros a vincular.
 * @throws {CarServiceError} Si ocurre un error durante la creación.
 */
async function linkInsurancesToCar(tx, carId, segurosData) {
  // Si no hay seguros adicionales para agregar, no hacer nada.
  if (!segurosData || segurosData.length === 0) {
    console.info(`No hay seguros adicionales para vincular al Carro ID: ${carId}`);
    return;
  }

  console.info(`Vinculando ${segurosData.length} seguros adicionales al carro ID: ${carId}`);

  try {
    // Prepara los datos para createMany
    const dataToCreate = segurosData.map(seguro => {
       // Validar aquí también podría ser útil, aunque Joi ya lo hizo
       if (!seguro.seguroId || !seguro.fechaInicio || !seguro.fechaFin) {
         throw new Error(`Datos incompletos para el seguro: ${JSON.stringify(seguro)}`);
       }
       return {
         id_carro: carId,
         id_seguro: seguro.seguroId,
         fechaInicio: new Date(seguro.fechaInicio), // Convertir a Date
         fechaFin: new Date(seguro.fechaFin),       // Convertir a Date
       };
    });

    // Usar createMany para eficiencia
    const result = await tx.seguroCarro.createMany({
      data: dataToCreate,
      skipDuplicates: false, // Lanzar error si hay duplicados (misma combinación carro-seguro, aunque aquí no debería pasar si los seguroId son distintos)
    });

    console.info(`Se crearon ${result.count} registros en SeguroCarro para el carro ID: ${carId}`);

  } catch (error) {
    console.error(`Error al vincular seguros al carro ID ${carId}:`, error);
    // Podrías verificar errores específicos de Prisma aquí (ej. P2003 si un id_seguro no existe)
     if (error.code === 'P2003' && error.meta?.field_name?.includes('id_seguro')) {
        throw new CarServiceError(`Error al vincular seguro: El tipo de seguro con ID proporcionado no existe. Código: ${error.code}`, 'NOT_FOUND_RELATED', error);
     }
    // Re-lanzar para que la transacción principal haga rollback
    throw new CarServiceError(
      `Error al crear los registros de seguros para el carro ${carId}.`,
      'INSURANCE_LINK_ERROR',
      error
    );
  }
}

module.exports = { linkInsurancesToCar };