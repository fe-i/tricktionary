/*
  Warnings:

  - A unique constraint covering the columns `[chooserId]` on the table `Room` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Room" ADD COLUMN "chooserId" TEXT;
ALTER TABLE "Room" ADD COLUMN "definition" TEXT;
ALTER TABLE "Room" ADD COLUMN "word" TEXT;

-- CreateTable
CREATE TABLE "FakeDefinition" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roomCode" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "definition" TEXT NOT NULL,
    "votes" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "FakeDefinition_roomCode_fkey" FOREIGN KEY ("roomCode") REFERENCES "Room" ("code") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Room_chooserId_key" ON "Room"("chooserId");
