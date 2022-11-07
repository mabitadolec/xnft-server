-- CreateTable
CREATE TABLE "DataQueueRequests" (
    "id" SERIAL NOT NULL,
    "burnerContract" TEXT NOT NULL,
    "txHash" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "DataQueueRequests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataMintEvents" (
    "id" SERIAL NOT NULL,
    "txHash" TEXT NOT NULL,
    "receiver" TEXT NOT NULL,
    "nftContract" TEXT NOT NULL,
    "tokenID" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "DataMintEvents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataTransactionStatus" (
    "id" SERIAL NOT NULL,
    "txHash" TEXT NOT NULL,
    "burnTXHash" TEXT NOT NULL,
    "minntTXHash" TEXT NOT NULL,
    "mintedToken" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "DataTransactionStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DataQueueRequests_txHash_key" ON "DataQueueRequests"("txHash");

-- CreateIndex
CREATE UNIQUE INDEX "DataMintEvents_txHash_key" ON "DataMintEvents"("txHash");

-- CreateIndex
CREATE UNIQUE INDEX "DataTransactionStatus_txHash_key" ON "DataTransactionStatus"("txHash");
