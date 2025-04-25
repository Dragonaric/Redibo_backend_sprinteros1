/*
  Warnings:

  - Changed the type of `genero` on the `Usuario` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Genero" AS ENUM ('MASCULINO', 'FEMENINO', 'OTRO');

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "foto" TEXT,
ADD COLUMN     "google_id" TEXT,
DROP COLUMN "genero",
ADD COLUMN     "genero" "Genero" NOT NULL,
ALTER COLUMN "contraseña" DROP NOT NULL;
