-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Room" (
    "code" TEXT NOT NULL PRIMARY KEY,
    "rounds" INTEGER NOT NULL DEFAULT 5,
    "playing" BOOLEAN NOT NULL DEFAULT false,
    "hostId" TEXT NOT NULL,
    "chooserId" TEXT,
    "currentRound" INTEGER NOT NULL DEFAULT 0,
    "word" TEXT,
    "definition" TEXT
);
INSERT INTO "new_Room" ("chooserId", "code", "definition", "hostId", "playing", "rounds", "word") SELECT "chooserId", "code", "definition", "hostId", "playing", "rounds", "word" FROM "Room";
DROP TABLE "Room";
ALTER TABLE "new_Room" RENAME TO "Room";
CREATE UNIQUE INDEX "Room_hostId_key" ON "Room"("hostId");
PRAGMA foreign_key_check("Room");
PRAGMA foreign_keys=ON;
