-- AlterTable
ALTER TABLE "Submenu" ADD COLUMN "icon" TEXT;

-- CreateTable
CREATE TABLE "TrainingApp" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "video" TEXT
);

-- CreateTable
CREATE TABLE "TrainingAppDetail" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "TrainingApp_slug_key" ON "TrainingApp"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "TrainingAppDetail_slug_key" ON "TrainingAppDetail"("slug");
