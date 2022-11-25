/*
  Warnings:

  - Added the required column `thumbnail` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnailId` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" ADD COLUMN     "thumbnail" TEXT NOT NULL,
ADD COLUMN     "thumbnailId" TEXT NOT NULL;
