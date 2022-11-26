/*
  Warnings:

  - Added the required column `origin` to the `banners` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "banners" ADD COLUMN     "origin" "BannerOrigin" NOT NULL;
