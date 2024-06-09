/*
  Warnings:

  - You are about to drop the column `gamesWon` on the `User` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT,
    "roomCode" TEXT,
    "titleId" INTEGER,
    "gamesPlayed" INTEGER NOT NULL DEFAULT 0,
    "highScore" INTEGER NOT NULL DEFAULT 0,
    "score" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "User_roomCode_fkey" FOREIGN KEY ("roomCode") REFERENCES "Room" ("code") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("email", "emailVerified", "gamesPlayed", "highScore", "id", "image", "name", "roomCode", "score", "titleId") SELECT "email", "emailVerified", "gamesPlayed", "highScore", "id", "image", "name", "roomCode", "score", "titleId" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
