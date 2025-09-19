/*
  Warnings:

  - Made the column `slug` on table `Chairman` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateTable
CREATE TABLE "PdfDocument" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Chairman" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "sub1" TEXT,
    "sub2" TEXT,
    "content" TEXT NOT NULL DEFAULT '',
    "image" TEXT,
    "position" TEXT,
    "period" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "city" TEXT,
    "ToS" TEXT
);
INSERT INTO "new_Chairman" ("ToS", "city", "content", "createdAt", "id", "image", "name", "period", "position", "slug", "sub1", "sub2", "title") SELECT "ToS", "city", "content", "createdAt", "id", "image", "name", "period", "position", "slug", "sub1", "sub2", "title" FROM "Chairman";
DROP TABLE "Chairman";
ALTER TABLE "new_Chairman" RENAME TO "Chairman";
CREATE UNIQUE INDEX "Chairman_slug_key" ON "Chairman"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "PdfDocument_slug_key" ON "PdfDocument"("slug");
