/*
  Warnings:

  - You are about to drop the column `id_seguro` on the `Carro` table. All the data in the column will be lost.
  - You are about to drop the column `fechaFin` on the `Seguro` table. All the data in the column will be lost.
  - You are about to drop the column `fechaInicio` on the `Seguro` table. All the data in the column will be lost.
  - You are about to drop the column `nombreEmpresa` on the `Seguro` table. All the data in the column will be lost.
  - Added the required column `empresa` to the `Seguro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre` to the `Seguro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoSeguro` to the `Seguro` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Carro" DROP CONSTRAINT "Carro_id_seguro_fkey";

-- AlterTable
ALTER TABLE "Carro" DROP COLUMN "id_seguro",
ADD COLUMN     "disponible_desde" TIMESTAMP(3),
ADD COLUMN     "disponible_hasta" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Seguro" DROP COLUMN "fechaFin",
DROP COLUMN "fechaInicio",
DROP COLUMN "nombreEmpresa",
ADD COLUMN     "empresa" TEXT NOT NULL,
ADD COLUMN     "nombre" TEXT NOT NULL,
ADD COLUMN     "tipoSeguro" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "SeguroCarro" (
    "id" SERIAL NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "id_carro" INTEGER NOT NULL,
    "id_seguro" INTEGER NOT NULL,

    CONSTRAINT "SeguroCarro_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SeguroCarro" ADD CONSTRAINT "SeguroCarro_id_carro_fkey" FOREIGN KEY ("id_carro") REFERENCES "Carro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeguroCarro" ADD CONSTRAINT "SeguroCarro_id_seguro_fkey" FOREIGN KEY ("id_seguro") REFERENCES "Seguro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
