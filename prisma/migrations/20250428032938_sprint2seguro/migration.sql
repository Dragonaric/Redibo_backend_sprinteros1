-- AlterTable
ALTER TABLE "Carro" ADD COLUMN     "id_seguro" INTEGER;

-- CreateTable
CREATE TABLE "Seguro" (
    "id" SERIAL NOT NULL,
    "nombreEmpresa" TEXT NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Seguro_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Carro" ADD CONSTRAINT "Carro_id_seguro_fkey" FOREIGN KEY ("id_seguro") REFERENCES "Seguro"("id") ON DELETE SET NULL ON UPDATE CASCADE;
