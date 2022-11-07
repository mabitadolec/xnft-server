-- CreateTable
CREATE TABLE "DataMintDetailsRecords" (
    "id" TEXT NOT NULL,
    "gas_maxFeePerGas" TEXT NOT NULL,
    "gas_maxPriorityFeePerGas" TEXT NOT NULL,
    "gas_gasLimit" TEXT NOT NULL,
    "gas_nonce" TEXT NOT NULL,
    "input_to" TEXT NOT NULL,
    "input_hash" TEXT NOT NULL,
    "input_proof" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DataMintDetailsRecords_pkey" PRIMARY KEY ("id")
);
