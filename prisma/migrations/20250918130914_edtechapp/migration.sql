/*
  Warnings:

  - You are about to drop the `PdfDocument` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PdfDocument";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Edtech" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "video" TEXT
);

-- CreateTable
CREATE TABLE "EdtechDetail" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Edtech_slug_key" ON "Edtech"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "EdtechDetail_slug_key" ON "EdtechDetail"("slug");
