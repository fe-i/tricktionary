-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT,
    "roomCode" TEXT,
    "gamesPlayed" INTEGER NOT NULL DEFAULT 0,
    "gamesWon" INTEGER NOT NULL DEFAULT 0,
    "highScore" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "User_roomCode_fkey" FOREIGN KEY ("roomCode") REFERENCES "Room" ("code") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("email", "emailVerified", "id", "image", "name", "roomCode") SELECT "email", "emailVerified", "id", "image", "name", "roomCode" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
