/*
  Warnings:

  - A unique constraint covering the columns `[userId,externalId]` on the table `StarredCharacter` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "userId_externalId_CompositeKey_UniqueConstraint" ON "StarredCharacter"("userId", "externalId");
