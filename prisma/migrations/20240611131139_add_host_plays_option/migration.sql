-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Room" (
    "code" TEXT NOT NULL PRIMARY KEY,
    "rounds" INTEGER NOT NULL DEFAULT 5,
    "hostPlays" BOOLEAN NOT NULL DEFAULT true,
    "playing" BOOLEAN NOT NULL DEFAULT false,
    "hostId" TEXT NOT NULL,
    "chooserId" TEXT,
    "currentRound" INTEGER NOT NULL DEFAULT 0,
    "word" TEXT,
    "definition" TEXT
);
INSERT INTO "new_Room" ("chooserId", "code", "currentRound", "definition", "hostId", "playing", "rounds", "word") SELECT "chooserId", "code", "currentRound", "definition", "hostId", "playing", "rounds", "word" FROM "Room";
DROP TABLE "Room";
ALTER TABLE "new_Room" RENAME TO "Room";
CREATE UNIQUE INDEX "Room_code_key" ON "Room"("code");
CREATE UNIQUE INDEX "Room_hostId_key" ON "Room"("hostId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
