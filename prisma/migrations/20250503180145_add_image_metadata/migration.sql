-- AlterTable
ALTER TABLE "Calificacion" ALTER COLUMN "calf_carro" DROP NOT NULL,
ALTER COLUMN "calf_usuario" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Carro" ADD COLUMN     "fecha_ingreso" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Imagen" ADD COLUMN     "format" TEXT,
ADD COLUMN     "height" INTEGER,
ADD COLUMN     "public_id" TEXT,
ADD COLUMN     "width" INTEGER;
