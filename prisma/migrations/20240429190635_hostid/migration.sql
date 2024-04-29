/*
  Warnings:

  - Added the required column `hostId` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
DROP TABLE IF EXISTS "new_Room";
CREATE TABLE "new_Room" (
    "code" TEXT NOT NULL PRIMARY KEY,
    "rounds" INTEGER NOT NULL DEFAULT 5,
    "difficulty" TEXT NOT NULL DEFAULT 'Medium',
    "playing" BOOLEAN NOT NULL DEFAULT false,
    "hostId" TEXT NOT NULL
);
INSERT INTO "new_Room" ("code", "difficulty", "playing", "rounds") SELECT "code", "difficulty", "playing", "rounds" FROM "Room";
DROP TABLE "Room";
ALTER TABLE "new_Room" RENAME TO "Room";
CREATE UNIQUE INDEX "Room_hostId_key" ON "Room"("hostId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
