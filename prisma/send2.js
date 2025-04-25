"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Declaración única para almacenar las relaciones UsuarioRol creadas
const usuarioRoles = [];
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // 1) Crear o recuperar los roles base
        const rolesBase = ['renter', 'host'];
        const roles = {};
        for (const rolName of rolesBase) {
            let rol = yield prisma.rol.findFirst({ where: { rol: rolName } });
            if (!rol) {
                rol = yield prisma.rol.create({ data: { rol: rolName } });
            }
            roles[rolName] = rol;
        }
        // 2) Asignar a cada usuario el rol de "host"
        const usuarios = yield prisma.usuario.findMany();
        // NOTA: Usamos la variable 'usuarioRoles' declarada al inicio, sin redeclararla
        for (const usuario of usuarios) {
            // Verificar si ya existe la relación UsuarioRol
            let ur = yield prisma.usuarioRol.findFirst({
                where: {
                    id_usuario: usuario.id,
                    id_rol: roles['host'].id,
                },
            });
            if (!ur) {
                ur = yield prisma.usuarioRol.create({
                    data: {
                        id_usuario: usuario.id,
                        id_rol: roles['host'].id,
                    },
                });
            }
            usuarioRoles.push(ur);
        }
        // 3) Crear una ciudad de ejemplo para las direcciones de los autos
        const ciudadLaPaz = yield prisma.ciudad.findFirst({ where: { nombre: 'La Paz' } });
        if (!ciudadLaPaz) {
            throw new Error('No existe la ciudad "La Paz". Asegúrate de haberla sembrado antes.');
        }
        let provinciaLP = yield prisma.provincia.findFirst({ where: { nombre: 'Provincia La Paz' } });
        if (!provinciaLP) {
            provinciaLP = yield prisma.provincia.create({
                data: {
                    nombre: 'Provincia La Paz',
                    ciudad: { connect: { id: ciudadLaPaz.id } },
                },
            });
        }
        // 4) Crear varias direcciones para asignar a los carros
        const direcciones = [];
        const direccionesData = [
            { calle: 'Av. Siempre Viva 742', zona: 'Centro', num_casa: '742' },
            { calle: 'Calle Falsa 123', zona: 'Sur', num_casa: '123' },
            { calle: 'Pje. del Sol 456', zona: 'Norte', num_casa: '456' },
            { calle: 'Av. del Maestro 789', zona: 'Este', num_casa: '789' },
        ];
        for (const d of direccionesData) {
            const dir = yield prisma.direccion.create({
                data: {
                    id_provincia: provinciaLP.id,
                    calle: d.calle,
                    zona: d.zona,
                    num_casa: d.num_casa,
                },
            });
            direcciones.push(dir);
        }
        // 5) Crear al menos 4 carros distintos, asignados a distintos hosts
        const carrosData = [
            {
                vim: '1HGCM82633A004352',
                año: 2015,
                marca: 'Toyota',
                modelo: 'Corolla',
                placa: 'ABC-1234',
                asientos: 5,
                puertas: 4,
                soat: true,
                precio_por_dia: 35.0,
                num_mantenimientos: 2,
                transmicion: 'Automática',
                estado: 'Disponible',
            },
            {
                vim: '2C3KA53G76H100001',
                año: 2018,
                marca: 'Honda',
                modelo: 'Civic',
                placa: 'DEF-5678',
                asientos: 5,
                puertas: 4,
                soat: true,
                precio_por_dia: 40.0,
                num_mantenimientos: 1,
                transmicion: 'Manual',
                estado: 'Disponible',
            },
            {
                vim: '3N1AB7AP5KY238001',
                año: 2020,
                marca: 'Nissan',
                modelo: 'Sentra',
                placa: 'GHI-9012',
                asientos: 5,
                puertas: 4,
                soat: true,
                precio_por_dia: 45.0,
                num_mantenimientos: 0,
                transmicion: 'Automática',
                estado: 'Disponible',
            },
            {
                vim: '1FTFW1ET4EKF51234',
                año: 2017,
                marca: 'Ford',
                modelo: 'F-150',
                placa: 'JKL-3456',
                asientos: 5,
                puertas: 4,
                soat: true,
                precio_por_dia: 60.0,
                num_mantenimientos: 3,
                transmicion: 'Automática',
                estado: 'Disponible',
            },
        ];
        for (let i = 0; i < carrosData.length; i++) {
            const carInfo = carrosData[i];
            const dir = direcciones[i];
            // Distribuimos los carros entre los UsuarioRol existentes
            const userRole = usuarioRoles[i % usuarioRoles.length];
            const carro = yield prisma.carro.create({
                data: Object.assign(Object.assign({}, carInfo), { id_direccion: dir.id, id_usuario_rol: userRole.id }),
            });
            // Crear una imagen vacía (podrías agregar datos en base64 según necesites)
            yield prisma.imagen.create({
                data: {
                    data: Buffer.from(''),
                    id_carro: carro.id,
                },
            });
        }
        // 6) Semilla: Características adicionales y tipos de combustible
        const caracteristicasAdicionales = [
            'Aire acondicionado',
            'Bluetooth',
            'GPS',
            'Portabicicletas',
            'Soporte para esquís',
            'Pantalla táctil',
            'Sillas para bebé',
            'Cámara de reversa',
            'Asientos de cuero',
            'Sistema antirrobo',
            'Toldo o rack de techo',
            'Vidrios polarizados',
            'Sistema de sonido',
        ];
        const tiposCombustible = ['Gasolina', 'GNV', 'Eléctrico', 'Diesel'];
        // Mapeamos cada característica a su ID (usa el modelo correcto de tu schema, aquí se asume "carasteristicasAdicionales")
        const caracteristicasMap = {};
        for (const nombre of caracteristicasAdicionales) {
            const existente = yield prisma.carasteristicasAdicionales.findFirst({
                where: { nombre },
            });
            const created = existente !== null && existente !== void 0 ? existente : (yield prisma.carasteristicasAdicionales.create({
                data: { nombre },
            }));
            caracteristicasMap[nombre] = created.id;
        }
        // Mapeamos cada tipo de combustible a su ID (usa el campo "tipoDeCombustible" según tu schema)
        const combustibleMap = {};
        for (const nombre of tiposCombustible) {
            const existente = yield prisma.tipoCombustible.findFirst({
                where: { tipoDeCombustible: nombre },
            });
            const created = existente !== null && existente !== void 0 ? existente : (yield prisma.tipoCombustible.create({
                // Nota: En tu schema tienes un campo "id_carro"; si este no es deseado, deberías ajustarlo.
                data: { tipoDeCombustible: nombre, id_carro: 0 },
            }));
            combustibleMap[nombre] = created.id;
        }
        // 7) Relacionar cada carro con características adicionales y con uno o más tipos de combustible
        const carros = yield prisma.carro.findMany();
        for (const carro of carros) {
            // Asignar 3 características aleatorias
            const shuffledCarac = [...caracteristicasAdicionales]
                .sort(() => 0.5 - Math.random())
                .slice(0, 3);
            for (const c of shuffledCarac) {
                yield prisma.caracteristicasAdicionalesCarro.create({
                    data: {
                        id_carro: carro.id,
                        id_carasteristicasAdicionales: caracteristicasMap[c],
                    },
                });
            }
            // Asignar 1 o 2 tipos de combustible aleatorios
            const shuffledComb = [...tiposCombustible]
                .sort(() => 0.5 - Math.random())
                .slice(0, Math.random() > 0.5 ? 2 : 1);
            for (const t of shuffledComb) {
                yield prisma.combustibleCarro.create({
                    data: {
                        id_carro: carro.id,
                        id_combustible: combustibleMap[t],
                    },
                });
            }
        }
        console.log('✅ Seed de roles, usuario-roles, direcciones, carros y asociaciones completado.');
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
