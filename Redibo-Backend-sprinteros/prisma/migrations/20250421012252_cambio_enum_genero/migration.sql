/*
  Warnings:

  - Made the column `genero` on table `Usuario` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Usuario" ALTER COLUMN "genero" SET NOT NULL;
