/*
  Warnings:

  - You are about to drop the `GemaEdTech` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GemaEdTechDetail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GemaImgUMKM` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GemaKop` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GemaKopDetail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GemaUMKM` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GemaUMKMDetail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Training` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TrainingBenefit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TrainingDetail` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "GemaEdTech";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "GemaEdTechDetail";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "GemaImgUMKM";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "GemaKop";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "GemaKopDetail";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "GemaUMKM";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "GemaUMKMDetail";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Training";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TrainingBenefit";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TrainingDetail";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "BannerPage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "image" TEXT
);
