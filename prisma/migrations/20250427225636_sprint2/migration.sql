/*
  Warnings:

  - You are about to drop the column `id_caracteristicasAdicionales` on the `caracteristicasAdicionalesCarro` table. All the data in the column will be lost.
  - You are about to drop the `Ejemplo` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `id_carasteristicasAdicionales` to the `caracteristicasAdicionalesCarro` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "caracteristicasAdicionalesCarro" DROP CONSTRAINT "caracteristicasAdicionalesCarro_id_caracteristicasAdiciona_fkey";

-- AlterTable
ALTER TABLE "Carro" ADD COLUMN     "NumeroViajes" INTEGER DEFAULT 0,
ADD COLUMN     "ingresoTotal" DOUBLE PRECISION DEFAULT 0;

-- AlterTable
ALTER TABLE "Direccion" ADD COLUMN     "latitud" DOUBLE PRECISION,
ADD COLUMN     "longitud" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Garantia" ADD COLUMN     "descripcion" TEXT,
ADD COLUMN     "id_reserva" INTEGER,
ADD COLUMN     "pagoPorDaños" BOOLEAN;

-- AlterTable
ALTER TABLE "Imagen" ALTER COLUMN "data" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "caracteristicasAdicionalesCarro" DROP COLUMN "id_caracteristicasAdicionales",
ADD COLUMN     "id_carasteristicasAdicionales" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Ejemplo";

-- CreateTable
CREATE TABLE "contratodeAlquiler" (
    "id" SERIAL NOT NULL,
    "id_reserva" INTEGER NOT NULL,
    "kilometraje" INTEGER NOT NULL,
    "id_carro" INTEGER NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',

    CONSTRAINT "contratodeAlquiler_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aeropuerto" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "latitud" DOUBLE PRECISION,
    "longitud" DOUBLE PRECISION,
    "id_ciudad" INTEGER NOT NULL,

    CONSTRAINT "aeropuerto_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "caracteristicasAdicionalesCarro" ADD CONSTRAINT "caracteristicasAdicionalesCarro_id_carasteristicasAdiciona_fkey" FOREIGN KEY ("id_carasteristicasAdicionales") REFERENCES "CarasteristicasAdicionales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Garantia" ADD CONSTRAINT "Garantia_id_reserva_fkey" FOREIGN KEY ("id_reserva") REFERENCES "Reserva"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contratodeAlquiler" ADD CONSTRAINT "contratodeAlquiler_id_carro_fkey" FOREIGN KEY ("id_carro") REFERENCES "Carro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aeropuerto" ADD CONSTRAINT "aeropuerto_id_ciudad_fkey" FOREIGN KEY ("id_ciudad") REFERENCES "Ciudad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
