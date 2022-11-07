/*
  Warnings:

  - You are about to drop the column `minntTXHash` on the `DataTransactionStatus` table. All the data in the column will be lost.
  - Added the required column `mintTXHash` to the `DataTransactionStatus` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DataTransactionStatus" DROP COLUMN "minntTXHash",
ADD COLUMN     "mintTXHash" TEXT NOT NULL;
