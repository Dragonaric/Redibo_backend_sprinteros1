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
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // 1) Crear o recuperar el país "Bolivia"
        let bolivia = yield prisma.pais.findFirst({
            where: { nombre: 'Bolivia' },
        });
        if (!bolivia) {
            bolivia = yield prisma.pais.create({
                data: { nombre: 'Bolivia' },
            });
        }
        // 2) Crear ciudades si no existen
        const ciudadesNombres = [
            'La Paz',
            'Cochabamba',
            'Santa Cruz',
            'Oruro',
            'Potosí',
            'Chuquisaca',
            'Tarija',
            'Beni',
            'Pando',
        ];
        for (const nombre of ciudadesNombres) {
            const existente = yield prisma.ciudad.findFirst({
                where: { nombre },
            });
            if (!existente) {
                yield prisma.ciudad.create({
                    data: {
                        nombre,
                        pais: { connect: { id: bolivia.id } },
                    },
                });
            }
        }
        // 3) Leer ciudades para obtener sus IDs
        const ciudadesBD = yield prisma.ciudad.findMany();
        // 4) Crear usuarios de prueba (si no existen ya)
        const usuariosSeed = [
            {
                nombre: 'Ana Pérez',
                genero: client_1.Genero.FEMENINO,
                fecha_nacimiento: new Date('1990-05-14'),
                contraseña: '1234',
                telefono: '78912345',
                id_ciudad: ciudadesBD.find((d) => d.nombre === 'La Paz').id,
            },
            {
                nombre: 'Carlos Gómez',
                genero: client_1.Genero.MASCULINO,
                fecha_nacimiento: new Date('1985-11-23'),
                contraseña: 'abcd',
                telefono: '71234567',
                id_ciudad: ciudadesBD.find((d) => d.nombre === 'Cochabamba').id,
            },
            {
                nombre: 'Luis Flores',
                genero: client_1.Genero.MASCULINO,
                fecha_nacimiento: new Date('1998-07-09'),
                contraseña: 'qwerty',
                telefono: '70123456',
                id_ciudad: ciudadesBD.find((d) => d.nombre === 'Santa Cruz').id,
            },
            {
                nombre: 'María Rojas',
                genero: client_1.Genero.FEMENINO,
                fecha_nacimiento: new Date('2000-01-01'),
                contraseña: 'pass',
                telefono: '76543210',
                id_ciudad: ciudadesBD.find((d) => d.nombre === 'Oruro').id,
            },
            {
                nombre: 'Patricia Díaz',
                genero: client_1.Genero.OTRO,
                fecha_nacimiento: new Date('1993-09-27'),
                contraseña: 'pat123',
                telefono: '73456789',
                id_ciudad: ciudadesBD.find((d) => d.nombre === 'Potosí').id,
            },
        ];
        for (const u of usuariosSeed) {
            const existe = yield prisma.usuario.findFirst({
                where: { nombre: u.nombre },
            });
            if (!existe) {
                yield prisma.usuario.create({ data: u });
            }
        }
        console.log('🌱 Datos semilla insertados correctamente');
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
