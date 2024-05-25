/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Post";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Title" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_TitleToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_TitleToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Title" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_TitleToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_TitleToUser_AB_unique" ON "_TitleToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_TitleToUser_B_index" ON "_TitleToUser"("B");
