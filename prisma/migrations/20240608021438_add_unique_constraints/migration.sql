/*
  Warnings:

  - A unique constraint covering the columns `[roomCode]` on the table `FakeDefinition` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Title` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title]` on the table `Title` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FakeDefinition_roomCode_key" ON "FakeDefinition"("roomCode");

-- CreateIndex
CREATE UNIQUE INDEX "Title_id_key" ON "Title"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Title_title_key" ON "Title"("title");
