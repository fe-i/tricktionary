-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Room" (
    "code" TEXT NOT NULL PRIMARY KEY,
    "rounds" INTEGER NOT NULL DEFAULT 5,
    "difficulty" TEXT NOT NULL DEFAULT 'Medium',
    "playing" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Room" ("code", "difficulty", "playing", "rounds") SELECT "code", "difficulty", "playing", "rounds" FROM "Room";
DROP TABLE "Room";
ALTER TABLE "new_Room" RENAME TO "Room";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
