/*
  Warnings:

  - You are about to drop the column `id_carasteristicasAdicionales` on the `caracteristicasAdicionalesCarro` table. All the data in the column will be lost.
  - Added the required column `id_caracteristicasAdicionales` to the `caracteristicasAdicionalesCarro` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_id_ciudad_fkey";

-- DropForeignKey
ALTER TABLE "caracteristicasAdicionalesCarro" DROP CONSTRAINT "caracteristicasAdicionalesCarro_id_carasteristicasAdiciona_fkey";

-- AlterTable
ALTER TABLE "Usuario" ALTER COLUMN "fecha_nacimiento" DROP NOT NULL,
ALTER COLUMN "id_ciudad" DROP NOT NULL,
ALTER COLUMN "telefono" DROP NOT NULL,
ALTER COLUMN "genero" DROP NOT NULL;

-- AlterTable
ALTER TABLE "caracteristicasAdicionalesCarro" DROP COLUMN "id_carasteristicasAdicionales",
ADD COLUMN     "id_caracteristicasAdicionales" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_id_ciudad_fkey" FOREIGN KEY ("id_ciudad") REFERENCES "Ciudad"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caracteristicasAdicionalesCarro" ADD CONSTRAINT "caracteristicasAdicionalesCarro_id_caracteristicasAdiciona_fkey" FOREIGN KEY ("id_caracteristicasAdicionales") REFERENCES "CarasteristicasAdicionales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
