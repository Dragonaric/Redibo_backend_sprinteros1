-- CreateTable
CREATE TABLE "PasswordRecoveryCode" (
    "id" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "correo" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PasswordRecoveryCode_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PasswordRecoveryCode" ADD CONSTRAINT "PasswordRecoveryCode_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
