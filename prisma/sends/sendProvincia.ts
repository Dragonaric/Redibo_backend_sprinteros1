import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Departamento {
  ciudad: string;
  provincias: string[];
}

// Datos de departamentos y provincias a sembrar
const departamentos: Departamento[] = [
  {
    ciudad: 'Beni',
    provincias: [
      'Cercado',
      'Antonio Vaca Díez',
      'Yacuma',
      'Moxos',
      'Marbán',
      'Mamoré',
      'Iténez',
      'Ballivián',
    ],
  },
  {
    ciudad: 'Chuquisaca',
    provincias: [
      'Oropeza',
      'Yamparáez',
      'Tomina',
      'Zudáñez',
      'Azurduy',
      'Belisario Boeto',
      'Hernando Siles',
      'Luis Calvo',
      'Nor Cinti',
      'Sud Cinti',
    ],
  },
  {
    ciudad: 'Cochabamba',
    provincias: [
      'Arani',
      'Arque',
      'Ayopaya',
      'Bolívar',
      'Campero',
      'Capinota',
      'Carrasco',
      'Cercado',
      'Chapare',
      'Esteban Arce',
      'Germán Jordán',
      'Mizque',
      'Punata',
      'Quillacollo',
      'Tapacarí',
      'Tiraque',
    ],
  },
  {
    ciudad: 'La Paz',
    provincias: [
      'Murillo',
      'Aroma',
      'Bautista Saavedra',
      'Camacho',
      'Caranavi',
      'Franz Tamayo',
      'Gualberto Villarroel',
      'Ingavi',
      'Inquisivi',
      'Iturralde',
      'José Manuel Pando',
      'Larecaja',
      'Loayza',
      'Los Andes',
      'Manco Kapac',
      'Muñecas',
      'Nor Yungas',
      'Omasuyos',
      'Pacajes',
      'Sud Yungas',
    ],
  },
  {
    ciudad: 'Oruro',
    provincias: [
      'Cercado',
      'Sajama',
      'Carangas',
      'Nor Carangas',
      'Sud Carangas',
      'Litoral',
      'Sabaya',
      'Poopó',
      'Eduardo Avaroa',
      'Pantaleón Dalence',
      'Saucarí',
      'Tomas Barrón',
      'Mejillones',
      'Ladislao Cabrera',
      'San Pedro de Totora',
      'Sebastián Pagador',
    ],
  },
  {
    ciudad: 'Pando',
    provincias: [
      'Abuná',
      'Federico Román',
      'Madre de Dios',
      'Manuripi',
      'Nicolás Suárez',
    ],
  },
  {
    ciudad: 'Potosí',
    provincias: [
      'Tomás Frías',
      'Antonio Quijarro',
      'Nor Chichas',
      'Sud Chichas',
      'Nor Lípez',
      'Sud Lípez',
      'Enrique Baldivieso',
      'Daniel Campos',
      'Rafael Bustillo',
      'Charcas',
      'Chayanta',
      'Cornelio Saavedra',
      'José María Linares',
      'Modesto Omiste',
      'Nor Cinti',
      'Sud Cinti',
    ],
  },
  {
    ciudad: 'Santa Cruz',
    provincias: [
      'Andrés Ibáñez',
      'Chiquitos',
      'Cordillera',
      'Florida',
      'Germán Busch',
      'Ichilo',
      'Guarayos',
      'Ñuflo de Chávez',
      'Obispo Santistevan',
      'Sara',
      'Vallegrande',
      'Velasco',
      'Ángel Sandoval',
      'Manuel María Caballero',
      'Warnes'
    ],
  },
  {
    ciudad: 'Tarija',
    provincias: [
      'Aniceto Arce',
      "Burnet O'Connor",
      'Cercado',
      'Eustaquio Méndez',
      'Gran Chaco',
      'José María Avilés',
    ],
  },
];

async function main() {
  // Leer todas las ciudades que ya se sembraron (desde send.ts)
  const ciudades = await prisma.ciudad.findMany();
  if (ciudades.length === 0) {
    throw new Error('No se encontraron ciudades. Asegúrate de haber sembrado las ciudades primero.');
  }

  // Iterar sobre cada departamento para crear las provincias correspondientes
  for (const dept of departamentos) {
    // Buscar la ciudad correspondiente al departamento
    const ciudad = ciudades.find((c) => c.nombre === dept.ciudad);
    if (!ciudad) {
      console.warn(`No se encontró la ciudad con nombre "${dept.ciudad}". Se omitirá la creación de sus provincias.`);
      continue;
    }

    for (const provNombre of dept.provincias) {
      // Verificar si la provincia ya existe para evitar duplicados
      const existente = await prisma.provincia.findFirst({
        where: { nombre: provNombre, id_ciudad: ciudad.id },
      });
      if (!existente) {
        await prisma.provincia.create({
          data: {
            nombre: provNombre,
            id_ciudad: ciudad.id,
          },
        });
        console.log(`Provincia "${provNombre}" creada para la ciudad "${ciudad.nombre}".`);
      } else {
        console.log(`Provincia "${provNombre}" ya existe para la ciudad "${ciudad.nombre}".`);
      }
    }
  }

  console.log('✅ Seed de provincias completado.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
