/*
  Warnings:

  - You are about to drop the column `fecha` on the `Reserva` table. All the data in the column will be lost.
  - Added the required column `fecha_fin` to the `Reserva` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fecha_inicio` to the `Reserva` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('HOST', 'RENTER', 'DRIVER');

-- AlterTable
ALTER TABLE "Reserva" DROP COLUMN "fecha",
ADD COLUMN     "estado" TEXT NOT NULL DEFAULT 'pendiente',
ADD COLUMN     "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fecha_expiracion" TIMESTAMP(3),
ADD COLUMN     "fecha_fin" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "fecha_inicio" TIMESTAMP(3) NOT NULL;
