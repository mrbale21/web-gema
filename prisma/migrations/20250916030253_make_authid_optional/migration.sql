-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Misi" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT,
    "title" TEXT NOT NULL,
    "authId" INTEGER,
    CONSTRAINT "Misi_authId_fkey" FOREIGN KEY ("authId") REFERENCES "VisiMisi" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Misi" ("authId", "id", "slug", "title") SELECT "authId", "id", "slug", "title" FROM "Misi";
DROP TABLE "Misi";
ALTER TABLE "new_Misi" RENAME TO "Misi";
CREATE UNIQUE INDEX "Misi_slug_key" ON "Misi"("slug");
CREATE TABLE "new_Visi" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT,
    "title" TEXT NOT NULL,
    "authId" INTEGER,
    CONSTRAINT "Visi_authId_fkey" FOREIGN KEY ("authId") REFERENCES "VisiMisi" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Visi" ("authId", "id", "slug", "title") SELECT "authId", "id", "slug", "title" FROM "Visi";
DROP TABLE "Visi";
ALTER TABLE "new_Visi" RENAME TO "Visi";
CREATE UNIQUE INDEX "Visi_slug_key" ON "Visi"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
