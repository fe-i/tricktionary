/*
  Warnings:

  - You are about to drop the `Title` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TitleToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `titleId` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Title_title_key";

-- DropIndex
DROP INDEX "Title_id_key";

-- DropIndex
DROP INDEX "_TitleToUser_B_index";

-- DropIndex
DROP INDEX "_TitleToUser_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Title";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_TitleToUser";
PRAGMA foreign_keys=on;

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
    "gamesPlayed" INTEGER NOT NULL DEFAULT 0,
    "highScore" INTEGER NOT NULL DEFAULT 0,
    "score" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "User_roomCode_fkey" FOREIGN KEY ("roomCode") REFERENCES "Room" ("code") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("email", "emailVerified", "gamesPlayed", "highScore", "id", "image", "name", "roomCode", "score") SELECT "email", "emailVerified", "gamesPlayed", "highScore", "id", "image", "name", "roomCode", "score" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
