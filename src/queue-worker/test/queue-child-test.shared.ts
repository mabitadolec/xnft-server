export const MINT_QUEUE_NAME = 'testQueue';

export const MINT_QUEUE_JOBTYPES = {
  test: 'test',
};

export type MintJobDataTypes = {
  address: string;
  amount: string;
  transactionHash: string;
  blockNumber: number;
};
