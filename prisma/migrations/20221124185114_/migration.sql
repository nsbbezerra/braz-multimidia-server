/*
  Warnings:

  - You are about to drop the column `user` on the `clients` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `clients` will be added. If there are existing duplicate values, this will fail.
  - Made the column `email` on table `clients` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "clients_user_key";

-- AlterTable
ALTER TABLE "clients" DROP COLUMN "user",
ALTER COLUMN "email" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "clients_email_key" ON "clients"("email");
