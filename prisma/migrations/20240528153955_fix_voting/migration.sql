/*
  Warnings:

  - You are about to drop the column `votes` on the `FakeDefinition` table. All the data in the column will be lost.
  - You are about to drop the column `definitionId` on the `Vote` table. All the data in the column will be lost.
  - Added the required column `roomCode` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FakeDefinition" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roomCode" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "definition" TEXT NOT NULL,
    CONSTRAINT "FakeDefinition_roomCode_fkey" FOREIGN KEY ("roomCode") REFERENCES "Room" ("code") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_FakeDefinition" ("definition", "id", "roomCode", "userId") SELECT "definition", "id", "roomCode", "userId" FROM "FakeDefinition";
DROP TABLE "FakeDefinition";
ALTER TABLE "new_FakeDefinition" RENAME TO "FakeDefinition";
CREATE UNIQUE INDEX "FakeDefinition_roomCode_userId_key" ON "FakeDefinition"("roomCode", "userId");
CREATE TABLE "new_Vote" (
    "userId" TEXT NOT NULL,
    "roomCode" TEXT NOT NULL,
    "fakeDefinitionId" TEXT,
    CONSTRAINT "Vote_roomCode_fkey" FOREIGN KEY ("roomCode") REFERENCES "Room" ("code") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Vote_fakeDefinitionId_fkey" FOREIGN KEY ("fakeDefinitionId") REFERENCES "FakeDefinition" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Vote" ("userId") SELECT "userId" FROM "Vote";
DROP TABLE "Vote";
ALTER TABLE "new_Vote" RENAME TO "Vote";
CREATE UNIQUE INDEX "Vote_userId_key" ON "Vote"("userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
