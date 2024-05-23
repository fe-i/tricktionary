-- DropIndex
DROP INDEX "Room_chooserId_key";

-- CreateIndex
CREATE INDEX "FakeDefinition_roomCode_userId_idx" ON "FakeDefinition"("roomCode", "userId");
