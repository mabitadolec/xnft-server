/*
  Warnings:

  - A unique constraint covering the columns `[burntxHash]` on the table `DataMintEvents` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `burntxHash` to the `DataMintEvents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DataMintEvents" ADD COLUMN     "burntxHash" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DataMintEvents_burntxHash_key" ON "DataMintEvents"("burntxHash");
