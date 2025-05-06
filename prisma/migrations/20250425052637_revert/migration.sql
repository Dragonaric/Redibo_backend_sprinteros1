/*
  Warnings:

  - Made the column `fecha_nacimiento` on table `Usuario` required. This step will fail if there are existing NULL values in that column.
  - Made the column `id_ciudad` on table `Usuario` required. This step will fail if there are existing NULL values in that column.
  - Made the column `telefono` on table `Usuario` required. This step will fail if there are existing NULL values in that column.
  - Made the column `genero` on table `Usuario` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_id_ciudad_fkey";

-- AlterTable
ALTER TABLE "Usuario" ALTER COLUMN "fecha_nacimiento" SET NOT NULL,
ALTER COLUMN "id_ciudad" SET NOT NULL,
ALTER COLUMN "telefono" SET NOT NULL,
ALTER COLUMN "genero" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_id_ciudad_fkey" FOREIGN KEY ("id_ciudad") REFERENCES "Ciudad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
