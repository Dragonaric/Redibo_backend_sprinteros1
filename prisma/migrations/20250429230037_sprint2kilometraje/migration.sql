/*
  Warnings:

  - You are about to drop the column `fecha` on the `Descuento` table. All the data in the column will be lost.
  - You are about to drop the column `porcentaje` on the `Descuento` table. All the data in the column will be lost.
  - You are about to drop the column `id_descuento` on the `Reserva` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Reserva" DROP CONSTRAINT "Reserva_id_descuento_fkey";

-- AlterTable
ALTER TABLE "Carro" ADD COLUMN     "id_tipodeDescuento" INTEGER;

-- AlterTable
ALTER TABLE "Descuento" DROP COLUMN "fecha",
DROP COLUMN "porcentaje",
ADD COLUMN     "id_descuentoTipo" INTEGER,
ADD COLUMN     "montoDescontado" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Reserva" DROP COLUMN "id_descuento",
ADD COLUMN     "hora_fin" INTEGER,
ADD COLUMN     "hora_inicio" INTEGER,
ADD COLUMN     "kilometraje" INTEGER,
ADD COLUMN     "montoPagoInicial" DOUBLE PRECISION,
ADD COLUMN     "montoTotalConDescuento" DOUBLE PRECISION,
ALTER COLUMN "fecha_fin" DROP NOT NULL;

-- CreateTable
CREATE TABLE "tipodeDescuento" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "porcentaje" DOUBLE PRECISION NOT NULL,
    "fecha_inicio" TIMESTAMP(3),
    "fecha_fin" TIMESTAMP(3),

    CONSTRAINT "tipodeDescuento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DescuentoToReserva" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_DescuentoToReserva_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_DescuentoToReserva_B_index" ON "_DescuentoToReserva"("B");

-- AddForeignKey
ALTER TABLE "Carro" ADD CONSTRAINT "Carro_id_tipodeDescuento_fkey" FOREIGN KEY ("id_tipodeDescuento") REFERENCES "tipodeDescuento"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Descuento" ADD CONSTRAINT "Descuento_id_descuentoTipo_fkey" FOREIGN KEY ("id_descuentoTipo") REFERENCES "tipodeDescuento"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DescuentoToReserva" ADD CONSTRAINT "_DescuentoToReserva_A_fkey" FOREIGN KEY ("A") REFERENCES "Descuento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DescuentoToReserva" ADD CONSTRAINT "_DescuentoToReserva_B_fkey" FOREIGN KEY ("B") REFERENCES "Reserva"("id") ON DELETE CASCADE ON UPDATE CASCADE;
