const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedSeguros() {
  try {
    await prisma.seguro.createMany({
      data: [
        {
          nombre: 'Autotal',
          tipoSeguro: 'Todo Riesgo',
          empresa: 'Nacional Seguros',
        },
        {
          nombre: 'Vagoneta Segura',
          tipoSeguro: 'Todo Riesgo',
          empresa: 'Nacional Seguros',
        },
        {
          nombre: 'Automotor Vital',
          tipoSeguro: 'Todo Riesgo',
          empresa: 'Nacional Seguros',
        },
        {
          nombre: 'SAT - Seguro a Terceros',
          tipoSeguro: 'Responsabilidad Civil',
          empresa: 'Nacional Seguros',
        },
        {
          nombre: 'AutoMotor Pesado',
          tipoSeguro: 'Todo Riesgo',
          empresa: 'Nacional Seguros',
        },
        {
          nombre: 'Cobertura Amplia',
          tipoSeguro: 'Todo Riesgo',
          empresa: 'La Boliviana Ciacruz',
        },
        {
          nombre: 'Responsabilidad Civil',
          tipoSeguro: 'Responsabilidad Civil',
          empresa: 'La Boliviana Ciacruz',
        },
        {
          nombre: 'Plan Clásico',
          tipoSeguro: 'Todo Riesgo',
          empresa: 'Alianza Seguros',
        },
        {
          nombre: 'Plan Plus',
          tipoSeguro: 'Todo Riesgo',
          empresa: 'Alianza Seguros',
        },
        {
          nombre: 'Plan Básico',
          tipoSeguro: 'Responsabilidad Civil',
          empresa: 'Alianza Seguros',
        },
        {
          nombre: 'Seguro Vehicular Completo',
          tipoSeguro: 'Todo Riesgo',
          empresa: 'Bisa Seguros',
        },
        {
          nombre: 'Seguro a Terceros',
          tipoSeguro: 'Responsabilidad Civil',
          empresa: 'Bisa Seguros',
        },
        {
          nombre: 'CrediAuto Total',
          tipoSeguro: 'Todo Riesgo',
          empresa: 'Crediseguro',
        },
        {
          nombre: 'CrediAuto Terceros',
          tipoSeguro: 'Responsabilidad Civil',
          empresa: 'Crediseguro',
        },
        {
          nombre: 'Fortaleza Auto Full',
          tipoSeguro: 'Todo Riesgo',
          empresa: 'Aseguradora Fortaleza',
        },
        {
          nombre: 'Fortaleza Auto Básico',
          tipoSeguro: 'Responsabilidad Civil',
          empresa: 'Aseguradora Fortaleza',
        },
        {
          nombre: 'Illimani Integral',
          tipoSeguro: 'Todo Riesgo',
          empresa: 'Seguros Illimani',
        },
        {
          nombre: 'Illimani Responsabilidad Civil',
          tipoSeguro: 'Responsabilidad Civil',
          empresa: 'Seguros Illimani',
        },
        {
          nombre: 'Fortaleza Auto Plus',
          tipoSeguro: 'Todo Riesgo',
          empresa: 'Compañía de Seguros y Reaseguros Fortaleza',
        },
        {
          nombre: 'Credinform Auto Total',
          tipoSeguro: 'Todo Riesgo',
          empresa: 'Seguros y Reaseguros Credinform International',
        },
        {
          nombre: 'Unibienes Auto Total',
          tipoSeguro: 'Todo Riesgo',
          empresa: 'Unibienes Seguros y Reaseguros Patrimoniales',
        },
        {
          nombre: 'Unibienes Responsabilidad Civil',
          tipoSeguro: 'Responsabilidad Civil',
          empresa: 'Unibienes Seguros y Reaseguros Patrimoniales',
        },
        // Puedes agregar más planes de cada empresa si lo deseas
      ],
      skipDuplicates: true, // Evita errores si ya existen registros con el mismo nombre
    });

    console.log('Datos de seguros insertados correctamente.');
  } catch (error) {
    console.error('Error al insertar datos de seguros:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedSeguros();