-- CreateTable
CREATE TABLE "Ejemplo" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "edad" INTEGER NOT NULL,
    "id_ciudad" INTEGER NOT NULL,

    CONSTRAINT "Ejemplo_pkey" PRIMARY KEY ("id")
);
