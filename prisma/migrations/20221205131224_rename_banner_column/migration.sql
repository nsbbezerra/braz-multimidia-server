/*
  Warnings:

  - You are about to drop the column `desktop` on the `banners` table. All the data in the column will be lost.
  - You are about to drop the column `desktopId` on the `banners` table. All the data in the column will be lost.
  - You are about to drop the column `mobile` on the `banners` table. All the data in the column will be lost.
  - You are about to drop the column `mobileId` on the `banners` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "banners" DROP COLUMN "desktop",
DROP COLUMN "desktopId",
DROP COLUMN "mobile",
DROP COLUMN "mobileId",
ADD COLUMN     "banner" TEXT,
ADD COLUMN     "bannerId" TEXT;
