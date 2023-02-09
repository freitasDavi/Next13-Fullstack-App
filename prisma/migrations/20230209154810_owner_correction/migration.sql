/*
  Warnings:

  - You are about to drop the column `onwerId` on the `Task` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_onwerId_fkey";

-- DropIndex
DROP INDEX "Task_onwerId_idx";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "onwerId",
ADD COLUMN     "ownerId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Task_ownerId_idx" ON "Task"("ownerId");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
