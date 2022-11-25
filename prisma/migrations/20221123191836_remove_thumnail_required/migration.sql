-- AlterTable
ALTER TABLE "categories" ALTER COLUMN "thumbnail" DROP NOT NULL,
ALTER COLUMN "thumbnailId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "modelings" ALTER COLUMN "image" DROP NOT NULL,
ALTER COLUMN "imageId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "thumbnail" DROP NOT NULL,
ALTER COLUMN "thumbnailId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "sizeTables" ALTER COLUMN "table" DROP NOT NULL,
ALTER COLUMN "tableId" DROP NOT NULL;
