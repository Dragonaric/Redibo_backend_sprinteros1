/*
  Warnings:

  - Changed the type of `genero` on the `Usuario` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- 1. Asegúrate de que el tipo enum ya exista
DO $$ BEGIN
  CREATE TYPE "Genero" AS ENUM ('MASCULINO', 'FEMENINO', 'OTRO');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. Agrega columna temporal de tipo enum
ALTER TABLE "Usuario" ADD COLUMN "genero_tmp" "Genero";

-- 3. Actualiza valores casteando explícitamente a tipo enum
UPDATE "Usuario"
SET "genero_tmp" = CASE LOWER(genero)
  WHEN 'masculino' THEN 'MASCULINO'::"Genero"
  WHEN 'femenino' THEN 'FEMENINO'::"Genero"
  WHEN 'otro' THEN 'OTRO'::"Genero"
  ELSE NULL
END;

-- 4. (opcional) Verifica si quedaron valores nulos
-- SELECT * FROM "Usuario" WHERE "genero_tmp" IS NULL;

-- 5. Elimina la columna antigua
ALTER TABLE "Usuario" DROP COLUMN "genero";

-- 6. Renombra la nueva columna
ALTER TABLE "Usuario" RENAME COLUMN "genero_tmp" TO "genero";


