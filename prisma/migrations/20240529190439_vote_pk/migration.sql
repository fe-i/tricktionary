-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Vote" (
    "userId" TEXT NOT NULL PRIMARY KEY,
    "roomCode" TEXT NOT NULL,
    "fakeDefinitionId" TEXT,
    CONSTRAINT "Vote_roomCode_fkey" FOREIGN KEY ("roomCode") REFERENCES "Room" ("code") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Vote_fakeDefinitionId_fkey" FOREIGN KEY ("fakeDefinitionId") REFERENCES "FakeDefinition" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Vote" ("fakeDefinitionId", "roomCode", "userId") SELECT "fakeDefinitionId", "roomCode", "userId" FROM "Vote";
DROP TABLE "Vote";
ALTER TABLE "new_Vote" RENAME TO "Vote";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
