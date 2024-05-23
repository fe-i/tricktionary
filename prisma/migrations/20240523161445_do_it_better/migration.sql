/*
  Warnings:

  - A unique constraint covering the columns `[roomCode,userId]` on the table `FakeDefinition` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "FakeDefinition_roomCode_userId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "FakeDefinition_roomCode_userId_key" ON "FakeDefinition"("roomCode", "userId");
