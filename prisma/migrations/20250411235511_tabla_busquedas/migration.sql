/*
  Warnings:

  - A unique constraint covering the columns `[correo]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `correo` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `genero` on the `Usuario` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "correo" TEXT NOT NULL,
DROP COLUMN "genero",
ADD COLUMN     "genero" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Busqueda" (
    "id" SERIAL NOT NULL,
    "criterio" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_usuario" INTEGER NOT NULL,

    CONSTRAINT "Busqueda_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_correo_key" ON "Usuario"("correo");

-- AddForeignKey
ALTER TABLE "Busqueda" ADD CONSTRAINT "Busqueda_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
