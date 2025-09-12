/*
  Warnings:

  - You are about to drop the `Statisctic` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Statisctic";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Statistic" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "image" TEXT
);
