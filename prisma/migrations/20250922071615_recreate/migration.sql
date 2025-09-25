-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProductSubTitle" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "desc" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "productId" INTEGER,
    CONSTRAINT "ProductSubTitle_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ProductSubTitle" ("desc", "id", "isActive", "productId", "title") SELECT "desc", "id", "isActive", "productId", "title" FROM "ProductSubTitle";
DROP TABLE "ProductSubTitle";
ALTER TABLE "new_ProductSubTitle" RENAME TO "ProductSubTitle";
CREATE TABLE "new_ProductSuperior" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "desc" TEXT,
    "icon" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "productId" INTEGER,
    CONSTRAINT "ProductSuperior_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ProductSuperior" ("desc", "icon", "id", "isActive", "productId", "title") SELECT "desc", "icon", "id", "isActive", "productId", "title" FROM "ProductSuperior";
DROP TABLE "ProductSuperior";
ALTER TABLE "new_ProductSuperior" RENAME TO "ProductSuperior";
CREATE TABLE "new_ProductTitle" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "desc" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "productId" INTEGER,
    CONSTRAINT "ProductTitle_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ProductTitle" ("desc", "id", "isActive", "productId", "title") SELECT "desc", "id", "isActive", "productId", "title" FROM "ProductTitle";
DROP TABLE "ProductTitle";
ALTER TABLE "new_ProductTitle" RENAME TO "ProductTitle";
CREATE TABLE "new_ProductType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "desc" TEXT,
    "icon" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "productId" INTEGER,
    CONSTRAINT "ProductType_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ProductType" ("desc", "icon", "id", "isActive", "productId", "title") SELECT "desc", "icon", "id", "isActive", "productId", "title" FROM "ProductType";
DROP TABLE "ProductType";
ALTER TABLE "new_ProductType" RENAME TO "ProductType";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
