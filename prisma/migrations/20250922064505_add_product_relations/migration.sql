/*
  Warnings:

  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Product";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProductBenefit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT,
    "title" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "productId" INTEGER,
    CONSTRAINT "ProductBenefit_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ProductBenefit" ("id", "isActive", "slug", "title") SELECT "id", "isActive", "slug", "title" FROM "ProductBenefit";
DROP TABLE "ProductBenefit";
ALTER TABLE "new_ProductBenefit" RENAME TO "ProductBenefit";
CREATE UNIQUE INDEX "ProductBenefit_slug_key" ON "ProductBenefit"("slug");
CREATE TABLE "new_ProductSubTitle" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "productId" INTEGER,
    CONSTRAINT "ProductSubTitle_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ProductSubTitle" ("desc", "id", "isActive", "title") SELECT "desc", "id", "isActive", "title" FROM "ProductSubTitle";
DROP TABLE "ProductSubTitle";
ALTER TABLE "new_ProductSubTitle" RENAME TO "ProductSubTitle";
CREATE TABLE "new_ProductSuperior" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "icon" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "productId" INTEGER,
    CONSTRAINT "ProductSuperior_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ProductSuperior" ("desc", "icon", "id", "isActive", "title") SELECT "desc", "icon", "id", "isActive", "title" FROM "ProductSuperior";
DROP TABLE "ProductSuperior";
ALTER TABLE "new_ProductSuperior" RENAME TO "ProductSuperior";
CREATE TABLE "new_ProductTitle" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "productId" INTEGER,
    CONSTRAINT "ProductTitle_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ProductTitle" ("desc", "id", "isActive", "title") SELECT "desc", "id", "isActive", "title" FROM "ProductTitle";
DROP TABLE "ProductTitle";
ALTER TABLE "new_ProductTitle" RENAME TO "ProductTitle";
CREATE TABLE "new_ProductType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "icon" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "productId" INTEGER,
    CONSTRAINT "ProductType_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ProductType" ("desc", "icon", "id", "isActive", "title") SELECT "desc", "icon", "id", "isActive", "title" FROM "ProductType";
DROP TABLE "ProductType";
ALTER TABLE "new_ProductType" RENAME TO "ProductType";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
