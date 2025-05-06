-- DropForeignKey
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_id_ciudad_fkey";

-- AlterTable
ALTER TABLE "Usuario" ALTER COLUMN "fecha_nacimiento" DROP NOT NULL,
ALTER COLUMN "id_ciudad" DROP NOT NULL,
ALTER COLUMN "telefono" DROP NOT NULL,
ALTER COLUMN "genero" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_id_ciudad_fkey" FOREIGN KEY ("id_ciudad") REFERENCES "Ciudad"("id") ON DELETE SET NULL ON UPDATE CASCADE;
