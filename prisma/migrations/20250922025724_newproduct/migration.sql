-- CreateTable
CREATE TABLE "NewProducts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT,
    "name" TEXT,
    "desc" TEXT,
    "link" TEXT,
    "image" TEXT
);

-- CreateTable
CREATE TABLE "NewProduct" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT,
    "title" TEXT,
    "desc" TEXT,
    "authId" INTEGER,
    CONSTRAINT "NewProduct_authId_fkey" FOREIGN KEY ("authId") REFERENCES "NewProducts" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "NewProductImage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT,
    "name" TEXT,
    "desc" TEXT,
    "image" TEXT,
    "authId" INTEGER,
    CONSTRAINT "NewProductImage_authId_fkey" FOREIGN KEY ("authId") REFERENCES "NewProduct" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "NewProductDetail" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT,
    "title" TEXT,
    "desc" TEXT,
    "icon" TEXT,
    "authId" INTEGER,
    CONSTRAINT "NewProductDetail_authId_fkey" FOREIGN KEY ("authId") REFERENCES "NewProduct" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "NewProducts_slug_key" ON "NewProducts"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "NewProduct_slug_key" ON "NewProduct"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "NewProductImage_slug_key" ON "NewProductImage"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "NewProductDetail_slug_key" ON "NewProductDetail"("slug");
