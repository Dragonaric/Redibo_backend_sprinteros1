const { PrismaClient, Prisma } = require('@prisma/client');

const prisma = new PrismaClient();

const createCar = async (req, res) => { // 'req' y 'res' se definen aquí
  // === PASO CLAVE PARA DEBUG P2003 (MOVIDO AQUÍ DENTRO) ===
  console.log("Verificando req.user..."); // Mensaje inicial
  if (!req.user || typeof req.user.id === 'undefined') {
      console.error("ERROR CRÍTICO: req.user o req.user.id no están definidos.");
      // Es importante devolver una respuesta aquí para evitar que el código continúe
      return res.status(401).json({ success: false, error: "Información de usuario inválida o no encontrada en la autenticación." });
  }
  // Si pasamos la verificación, podemos usar req.user.id
  const userIdFromToken = req.user.id;
  console.log(`ID de usuario obtenido del token: ${userIdFromToken}`);
  // === FIN PASO CLAVE ===

  try {
    // === 1. Extraer datos del Body ===
    const {
      direccion,
      datosPrincipales,
      caracteristicas,
      caracteristicasAdicionales,
      finalizacion
    } = req.body;

    // === 2. Validación ===
    if (!datosPrincipales?.vin || datosPrincipales.vin.length !== 17) {
      return res.status(400).json({ error: "El VIN debe tener 17 caracteres" });
    }
    // ... otras validaciones ...


    // === 3. Manejar Jerarquía de Ubicación (findUnique/findFirst + create) ===

    // 3.1. País
    let pais = await prisma.pais.findUnique({ where: { nombre: direccion.pais } });
    if (!pais) {
      pais = await prisma.pais.create({ data: { nombre: direccion.pais } });
      console.log(`País creado: ${pais.nombre} (ID: ${pais.id})`);
    } else {
      console.log(`País encontrado: ${pais.nombre} (ID: ${pais.id})`);
    }

    // 3.2. Ciudad (Departamento) - Usando findFirst
    console.log(`Buscando ciudad '${direccion.departamento}' en país ID ${pais.id}...`);
    let ciudad = await prisma.ciudad.findFirst({
      where: { nombre: direccion.departamento, id_pais: pais.id },
    });
    if (!ciudad) {
      console.log(`Ciudad no encontrada, creando '${direccion.departamento}' en país ${pais.id}...`);
      ciudad = await prisma.ciudad.create({
        data: { nombre: direccion.departamento, pais: { connect: { id: pais.id } } },
      });
      console.log(`Ciudad creada: ${ciudad.nombre} (ID: ${ciudad.id})`);
    } else {
      console.log(`Ciudad encontrada: ${ciudad.nombre} (ID: ${ciudad.id})`);
    }

    // 3.3. Crear la Dirección principal, conectando/creando la Provincia
    const nuevaDireccion = await prisma.direccion.create({
      data: {
        calle: direccion.calle,
        num_casa: direccion.numCasa,
        zona: direccion.provincia,
        provincia: {
          connectOrCreate: {
            where: { nombre_id_ciudad: { nombre: direccion.provincia, id_ciudad: ciudad.id } }, // Usa nombre por defecto
            create: { nombre: direccion.provincia, ciudad: { connect: { id: ciudad.id } } }
          }
        }
      }
    });
    console.log(`Dirección creada (ID: ${nuevaDireccion.id})`);


    // === 4. Crear el Carro y sus relaciones anidadas ===
    console.log(`Intentando crear Carro para usuario ID: ${userIdFromToken} y dirección ID: ${nuevaDireccion.id}`);
    const nuevoCarro = await prisma.carro.create({
      data: {
        // --- Mapeo y Campos ---
        vim: datosPrincipales.vin,                  // Ajusta si es necesario
        año: parseInt(datosPrincipales.anio),       // Ajusta si es necesario
        marca: datosPrincipales.marca,
        modelo: datosPrincipales.modelo,
        placa: datosPrincipales.placa,              // Asegura @unique
        id_direccion: nuevaDireccion.id,
        asientos: caracteristicas.asientos,
        puertas: caracteristicas.puertas,
        soat: caracteristicas.seguro,               // Ajusta si es necesario
        precio_por_dia: finalizacion.precioAlquiler,// Ajusta si es necesario
        num_mantenimientos: finalizacion.mantenimientos, // Ajusta si es necesario
        transmicion: caracteristicas.transmision,   // Ajusta si es necesario
        estado: "DISPONIBLE",
        // --- CLAVE FORÁNEA USUARIO (¡VERIFICA NOMBRE!) ---
        id_usuario_rol: userIdFromToken, // O idUsuario: userIdFromToken,
        // ----------------------------------------------
        descripcion: finalizacion.descripcion,

        // --- Relaciones Anidadas ---
        combustiblesporCarro: { /* ... */ },
        caracteristicasAdicionalesCarro: { /* ... */ },
        imagenes: { /* ... */ }
      },
      // --- Includes ---
      include: {
        direccion: { include: { provincia: { include: { ciudad: { include: { pais: true } } } } } },
        combustiblesporCarro: { include: { combustible: true } },
        caracteristicasAdicionalesCarro: { include: { carasteristicasAdicionales: true } }, // Revisa typo
        imagenes: { select: { id: true } }
      }
    });
    console.log(`Carro creado (ID: ${nuevoCarro.id})`);

    // === 5. Enviar Respuesta Exitosa ===
    res.status(201).json({
      success: true,
      data: nuevoCarro
    });

  } catch (error) {
    // === 6. Manejo Centralizado de Errores ===
    console.error("Error detallado al crear coche:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') { /* ... */ }
         if (error.code === 'P2003') {
             const fieldName = error.meta?.field_name || '(no disponible)';
             console.error(`Prisma Error P2003: Violación de clave foránea en el campo: ${fieldName}`);
             const userFriendlyError = fieldName.includes('usuario') || fieldName === '(no disponible)' // Asumir usuario si no hay detalle
                 ? "El usuario asociado no existe o es inválido. Verifique la autenticación."
                 : `Error de base de datos: No se pudo encontrar el registro relacionado (${fieldName}).`;
             return res.status(400).json({ success: false, error: userFriendlyError, code: error.code, details: process.env.NODE_ENV === 'development' ? error.message : undefined });
         }
         if (error.code === 'P2022') { /* ... */ } // Añadir manejo si vuelve a aparecer
        return res.status(400).json({ success: false, error: `Error de base de datos: ${error.message}`, code: error.code });
    }
    if (error instanceof Prisma.PrismaClientValidationError) { /* ... */ }
    res.status(error.statusCode || 500).json({ success: false, error: error.message || "Error interno del servidor.", details: process.env.NODE_ENV === 'development' ? error.stack : undefined });

  } finally {
    // === 7. Desconexión de Prisma ===
    try { await prisma.$disconnect(); } catch (e) { console.error("Error al desconectar Prisma:", e); }
  }
};

module.exports = { createCar };




// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

// const createCar = async (req, res) => {
//   try {
//     const { 
//       direccion,
//       datosPrincipales,
//       caracteristicas,
//       caracteristicasAdicionales,
//       finalizacion
//     } = req.body;

//     // Validación mejorada
//     if (!datosPrincipales?.vin || datosPrincipales.vin.length !== 17) {
//       return res.status(400).json({ error: "El VIN debe tener 17 caracteres" });
//     }

//     // Verificar tamaño de imágenes (ejemplo: máximo 2MB cada una)
//     finalizacion.imagenes.forEach(img => {
//       const base64Length = img.length - (img.indexOf(',') + 1);
//       const sizeInBytes = 4 * Math.ceil(base64Length / 3) * 0.5624896334383812;
//       if (sizeInBytes > 2 * 1024 * 1024) {
//         throw new Error(`La imagen excede el tamaño máximo de 2MB`);
//       }
//     });

//     // === 3. Manejar Jerarquía de Ubicación (País -> Ciudad -> Provincia) ===
//     // Usamos upsert para obtener/crear cada nivel y obtener sus IDs.

//     // 3.1. País
//     const paisUpserted = await prisma.pais.upsert({
//       where: { nombre: direccion.pais }, // Asume: model Pais { nombre String @unique }
//       update: {}, // No actualizar si existe
//       create: { nombre: direccion.pais },
//     });

//     // 3.2. Ciudad (Departamento)
//     const ciudadUpserted = await prisma.ciudad.upsert({
//       // Usar índice compuesto: @@unique([nombre, id_pais]) en model Ciudad
//       where: { nombre_id_pais: { nombre: direccion.departamento, id_pais: paisUpserted.id } },
//       update: {},
//       create: {
//         nombre: direccion.departamento,
//         pais: { connect: { id: paisUpserted.id } } // Conectar al país
//       },
//     });

//     // 3.3. Crear la Dirección principal, conectando/creando la Provincia
//     const nuevaDireccion = await prisma.direccion.create({
//       data: {
//         // Nombres de campo como en el schema Prisma (ajusta si es necesario)
//         calle: direccion.calle,
//         num_casa: direccion.numCasa,   // Asume schema: num_casa String?
//         zona: direccion.provincia,     // Copiando provincia a zona (campo obligatorio en schema)
//         provincia: {                   // Relación a Provincia
//           connectOrCreate: {
//             // Usar índice compuesto: @@unique([nombre, id_ciudad]) en model Provincia
//             where: {
//               Provincia_nombre_ciudad_uq: { // Índice @@unique([nombre, id_ciudad], map: "...")
//                 nombre: direccion.provincia,
//                 id_ciudad: ciudadUpserted.id // Usamos el ID obtenido antes
//               }
//             },
//             // Datos para crear Provincia si no existe
//             create: {
//               nombre: direccion.provincia,
//               ciudad: { connect: { id: ciudadUpserted.id } } // Conectar a la ciudad
//             }
//           }
//         }
//       }
//       // No incluimos la relación aquí, lo haremos al final si es necesario
//     });

//     // 1. Crear dirección
//     // const nuevaDireccion = await prisma.direccion.create({
//     //   data: {
//     //     calle: direccion.calle,
//     //     num_casa: direccion.numCasa,
//     //     zona: direccion.provincia, // <-- Copia provincia a zona
//     //     provincia: {
//     //       connectOrCreate: {
//     //         where: { nombre: direccion.provincia },
//     //         create: {
//     //           nombre: direccion.provincia,
//     //           ciudad: {
//     //             connectOrCreate: {
//     //               where: { nombre: direccion.departamento },
//     //               create: {
//     //                 nombre: direccion.departamento,
//     //                 pais: {
//     //                   connectOrCreate: {
//     //                     where: { nombre: direccion.pais },
//     //                     create: { nombre: direccion.pais }
//     //                   }
//     //                 }
//     //               }
//     //             }
//     //           }
//     //         }
//     //       }
//     //     }
//     //   }
//     // });


//      // === 4. Crear el Carro y sus relaciones anidadas ===
//      const nuevoCarro = await prisma.carro.create({
//       data: {
//         // --- Mapeo de Nombres: JS/UI -> Schema Prisma ---
//         vim: datosPrincipales.vin,                  // JS: vin -> Schema: vim (ajusta si corregiste schema)
//         año: parseInt(datosPrincipales.anio),       // JS: anio -> Schema: año (ajusta si corregiste schema)
//         marca: datosPrincipales.marca,
//         modelo: datosPrincipales.modelo,
//         placa: datosPrincipales.placa,
//         id_direccion: nuevaDireccion.id,            // FK a la dirección creada
//         asientos: caracteristicas.asientos,
//         puertas: caracteristicas.puertas,
//         soat: caracteristicas.seguro,               // JS: seguro -> Schema: soat
//         precio_por_dia: finalizacion.precioAlquiler,// JS: precioAlquiler -> Schema: precio_por_dia
//         num_mantenimientos: finalizacion.mantenimientos, // JS: mantenimientos -> Schema: num_mantenimientos
//         transmicion: caracteristicas.transmision,   // JS: transmision -> Schema: transmicion (con typo)
//         estado: "DISPONIBLE",                       // Valor por defecto o asignado
//         id_usuario_rol: req.user.id,                // FK al usuario autenticado (Asume schema: id_usuario_rol)
//         descripcion: finalizacion.descripcion,      // Puede ser null si es opcional

//         // --- Relaciones Anidadas (usar nombres de relación/modelo del SCHEMA) ---

//         // Combustibles (Muchos a Muchos)
//         combustiblesporCarro: { // Asume nombre de relación en schema Carro
//           create: caracteristicas.combustible.split(',').map(comb => ({
//             combustible: { // Asume relación a TipoCombustible
//               connectOrCreate: {
//                 // Asume campo único en TipoCombustible
//                 where: { tipoDeCombustible: comb.trim() },
//                 create: { tipoDeCombustible: comb.trim() }
//               }
//             }
//           }))
//         },

//         // Características Adicionales (Muchos a Muchos)
//         caracteristicasAdicionalesCarro: { // Asume nombre de relación en schema Carro (con typo?)
//           create: Object.entries(caracteristicasAdicionales)
//             .filter(([_, value]) => value === true) // Solo las marcadas como true
//             .map(([key]) => ({
//               // Asume relación a CarasteristicasAdicionales en tabla intermedia (con typo?)
//               carasteristicasAdicionales: {
//                 connectOrCreate: {
//                   // Asume campo único en CarasteristicasAdicionales
//                   where: { nombre: key },
//                   create: { nombre: key }
//                 }
//               }
//             }))
//         },

//         // Imágenes (Uno a Muchos)
//         imagenes: { // Asume nombre de relación en schema Carro
//           create: finalizacion.imagenes.map(imgBase64 => {
//             // Extraer solo datos base64 (quitar prefijo si existe)
//             const base64Data = imgBase64.includes(',') ? imgBase64.split(',')[1] : imgBase64;
//             if (!base64Data) {
//               // Considera lanzar un error o loguear si falta la data
//               console.warn("Imagen base64 inválida o vacía recibida.");
//               return null; // O manejarlo de otra forma
//             }
//             try {
//                return {
//                  // Asume campo 'data' de tipo Bytes en schema Imagen
//                  data: Buffer.from(base64Data, 'base64')
//                };
//             } catch (bufferError) {
//                console.error(`Error creando buffer para imagen: ${bufferError.message}`);
//                // Decide cómo manejar este error (¿ignorar imagen?, ¿fallar todo?)
//                return null; // Ignorar imagen inválida por ahora
//             }
//           }).filter(imgData => imgData !== null) // Filtrar imágenes inválidas
//         }
//       },
//       // --- Incluir datos relacionados en el resultado ---
//       include: {
//         direccion: { // Incluir la dirección asociada
//             include: {
//                 provincia: { // Incluir la provincia
//                     include: {
//                         ciudad: { // Incluir la ciudad
//                             include: {
//                                 pais: true // Incluir el país
//                             }
//                         }
//                     }
//                 }
//             }
//         },
//         combustiblesporCarro: { // Usar nombre de relación del schema
//             include: {
//                 combustible: true // Incluir detalles del combustible
//             }
//         },
//         caracteristicasAdicionalesCarro: { // Usar nombre de relación del schema (con typo?)
//             include: {
//                 carasteristicasAdicionales: true // Incluir detalles de característica (con typo?)
//             }
//         },
//         imagenes: { // Incluir objetos de imagen (sin la data binaria pesada por defecto)
//             select: {
//                 id: true
//                 // Añade más campos si los necesitas, evita 'data' si no es necesario
//             }
//         }
//         // Considera incluir 'usuario' si necesitas devolver info del propietario
//         // usuario: { select: { id: true, nombre: true } }
//       }
//     });


//     // === 5. Preparar y Enviar Respuesta Exitosa ===
//     // Puedes transformar 'nuevoCarro' si necesitas que la respuesta use nombres diferentes
//     // al schema, pero por simplicidad lo devolvemos tal cual (con datos incluidos).
//     res.status(201).json({
//       success: true,
//       data: nuevoCarro // Contiene el carro creado y los datos incluidos
//     });

//     // 2. Crear vehículo con transacción
//     // const [nuevoCarro] = await prisma.$transaction([
//     //   prisma.carro.create({
//     //     data: {
//     //       vim: datosPrincipales.vin,
//     //       año: parseInt(datosPrincipales.anio),
//     //       marca: datosPrincipales.marca,
//     //       modelo: datosPrincipales.modelo,
//     //       placa: datosPrincipales.placa,
//     //       id_direccion: nuevaDireccion.id,
//     //       asientos: caracteristicas.asientos,
//     //       puertas: caracteristicas.puertas,
//     //       soat: caracteristicas.seguro,
//     //       precio_por_dia: finalizacion.precioAlquiler,
//     //       num_mantenimientos: finalizacion.mantenimientos,
//     //       transmicion: caracteristicas.transmision,
//     //       estado: "DISPONIBLE",
//     //       id_usuario_rol: req.user.id,
//     //       descripcion: finalizacion.descripcion,
//     //       combustiblesporCarro: {
//     //         create: caracteristicas.combustible.split(',').map(comb => ({
//     //           combustible: {
//     //             connectOrCreate: {
//     //               where: { tipoDeCombustible: comb.trim() },
//     //               create: { tipoDeCombustible: comb.trim() }
//     //             }
//     //           }
//     //         }))
//     //       },
//     //       caracteristicasAdicionalesCarro: {
//     //         create: Object.entries(caracteristicasAdicionales)
//     //           .filter(([_, value]) => value === true)
//     //           .map(([key]) => ({
//     //             carasteristicasAdicionales: {
//     //               connectOrCreate: {
//     //                 where: { nombre: key },
//     //                 create: { nombre: key }
//     //               }
//     //             }
//     //           }))
//     //       },
//     //       imagenes: {
//     //         create: finalizacion.imagenes.map(imgBase64 => ({
//     //           data: Buffer.from(imgBase64.split(',')[1], 'base64')
//     //         }))
//     //       }
//     //     },
//     //     include: {
//     //       combustiblesporCarro: { include: { combustible: true } },
//     //       caracteristicasAdicionalesCarro: { 
//     //         include: { carasteristicasAdicionales: true } 
//     //       },
//     //       imagenes: true
//     //     }
//     //   })
//     // ]);

//     // res.status(201).json({
//     //   success: true,
//     //   data: {
//     //     ...nuevoCarro,
//     //     imagenes: nuevoCarro.imagenes.map(img => ({
//     //       ...img,
//     //       data: img.data.toString('base64') // Convertir Buffer a base64 para respuesta
//     //     }))
//     //   }
//     // });

//   } catch (error) {
//     console.error("Error detallado:", error);
    
//     if (error.code === 'P2002') {
//       const field = error.meta?.target?.join(', ');
//       return res.status(400).json({
//         error: `El valor ya existe para el campo: ${field}`,
//         field
//       });
//     }

//     res.status(error.statusCode || 500).json({
//       error: error.message || "Error interno del servidor",
//       details: process.env.NODE_ENV === 'development' ? error.stack : undefined
//     });
//   } finally {
//     await prisma.$disconnect();
//   }
// };

// module.exports = { createCar };