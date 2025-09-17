/*
  Warnings:

  - You are about to drop the `GemaUMKMImg` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "GemaUMKMImg";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "GemaImgUMKM" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "image" TEXT
);
