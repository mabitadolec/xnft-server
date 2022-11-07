/*
  Warnings:

  - Changed the type of `data` on the `DataMintEvents` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `data` on the `DataQueueRequests` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "DataMintEvents" DROP COLUMN "data",
ADD COLUMN     "data" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "DataQueueRequests" DROP COLUMN "data",
ADD COLUMN     "data" JSONB NOT NULL;
