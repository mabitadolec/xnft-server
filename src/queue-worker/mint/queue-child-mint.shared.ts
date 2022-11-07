export const MINT_QUEUE_NAME = 'mintQueue';

export const MINT_QUEUE_JOBTYPES = {
  mint: 'mint',
};

export type MintJobDataTypes = {
  address: string;
  amount: string;
  transactionHash: string;
  blockNumber: number;
};
