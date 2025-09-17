-- CreateTable
CREATE TABLE "GemaEdTech" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "GemaEdTechDetail" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "icon" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "GemaKop" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "title1" TEXT NOT NULL,
    "desc1" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "GemaKopDetail" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "icon" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "GemaUMKM" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "GemaUMKMImg" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "image" TEXT
);

-- CreateTable
CREATE TABLE "GemaUMKMDetail" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "icon" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Training" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "icon" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "TrainingDetail" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "icon" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "TrainingBenefit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT,
    "title" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "GemaEdTech_slug_key" ON "GemaEdTech"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "GemaEdTechDetail_slug_key" ON "GemaEdTechDetail"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "GemaKop_slug_key" ON "GemaKop"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "GemaKopDetail_slug_key" ON "GemaKopDetail"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "GemaUMKM_slug_key" ON "GemaUMKM"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "GemaUMKMImg_slug_key" ON "GemaUMKMImg"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "GemaUMKMDetail_slug_key" ON "GemaUMKMDetail"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Training_slug_key" ON "Training"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "TrainingDetail_slug_key" ON "TrainingDetail"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "TrainingBenefit_slug_key" ON "TrainingBenefit"("slug");
