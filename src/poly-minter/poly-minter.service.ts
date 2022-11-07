import { Injectable } from '@nestjs/common';
import {
  BaseProvider,
  Contract,
  EthersContract,
  EthersSigner,
  InjectContractProvider,
  InjectEthersProvider,
  InjectSignerProvider,
  Wallet,
} from 'nestjs-ethers';
import { ethers } from 'ethers';
import { HttpService } from '@nestjs/axios';

type NftQueryCacheType = {
  [key: string]: { data: any; expires: number };
};

type GasPriceType = {
  safeLow: {
    maxPriorityFee: number;
    maxFee: number;
  };
  standard: {
    maxPriorityFee: number;
    maxFee: number;
  };
  fast: {
    maxPriorityFee: number;
    maxFee: number;
  };
  estimatedBaseFee: number;
  blockTime: number;
  blockNumber: number;
};

const cacheExpire = 60 * 1000; // 1 minute
@Injectable()
export class PolyMinterService {
  contract: Contract;
  nftQueryCache: NftQueryCacheType = {};

  constructor(
    @InjectEthersProvider('matic')
    private readonly ethersProvider: BaseProvider,

    @InjectSignerProvider('matic')
    private readonly signer: EthersSigner,

    @InjectContractProvider('matic')
    private readonly ethersContract: EthersContract,

    private readonly httpService: HttpService,
  ) {}

  onModuleInit() {
    this.bootStrapContract();
  }

  async bootStrapContract(): Promise<Contract> {
    const wallet: Wallet = this.signer.createWallet(
      process.env.MINTER_INTERACTOR_PK,
    );

    const ABI = [
      {
        inputs: [
          { internalType: 'string', name: 'name_', type: 'string' },
          { internalType: 'string', name: 'symbol_', type: 'string' },
          { internalType: 'string', name: 'baseURI_', type: 'string' },
          { internalType: 'string', name: 'contractURI_', type: 'string' },
          {
            internalType: 'uint256',
            name: 'initialMintLimit_',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'proxyRegistryAddress_',
            type: 'address',
          },
          { internalType: 'bytes32', name: 'merkleRoot_', type: 'bytes32' },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'approved',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
        ],
        name: 'Approval',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'operator',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'bool',
            name: 'approved',
            type: 'bool',
          },
        ],
        name: 'ApprovalForAll',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'address',
            name: 'userAddress',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'address payable',
            name: 'relayerAddress',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'bytes',
            name: 'functionSignature',
            type: 'bytes',
          },
        ],
        name: 'MetaTransactionExecuted',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'previousOwner',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'newOwner',
            type: 'address',
          },
        ],
        name: 'OwnershipTransferred',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'address',
            name: 'account',
            type: 'address',
          },
        ],
        name: 'Paused',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'uint256',
            name: 'generatedNumber_',
            type: 'uint256',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'randomNumber_',
            type: 'uint256',
          },
        ],
        name: 'TestEvent',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'from',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
        ],
        name: 'Transfer',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'address',
            name: 'account',
            type: 'address',
          },
        ],
        name: 'Unpaused',
        type: 'event',
      },
      {
        inputs: [],
        name: 'ERC712_VERSION',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'uint256', name: 'nextBatchSize_', type: 'uint256' },
        ],
        name: '_allocateNewSlots',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'uint256', name: 'newBatchSize_', type: 'uint256' },
        ],
        name: 'allocateNewSlots',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
        ],
        name: 'approve',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'baseTokenURI',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'bytes32[]', name: '_proof', type: 'bytes32[]' },
          { internalType: 'bytes32', name: '_leaf', type: 'bytes32' },
        ],
        name: 'checkWhiteList',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'contractURI',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'userAddress', type: 'address' },
          { internalType: 'bytes', name: 'functionSignature', type: 'bytes' },
          { internalType: 'bytes32', name: 'sigR', type: 'bytes32' },
          { internalType: 'bytes32', name: 'sigS', type: 'bytes32' },
          { internalType: 'uint8', name: 'sigV', type: 'uint8' },
        ],
        name: 'executeMetaTransaction',
        outputs: [{ internalType: 'bytes', name: '', type: 'bytes' }],
        stateMutability: 'payable',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
        name: 'getApproved',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'getChainId',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'getDomainSeperator',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
        name: 'getNonce',
        outputs: [{ internalType: 'uint256', name: 'nonce', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'bytes32', name: '_hash', type: 'bytes32' }],
        name: 'getTransactionEvents',
        outputs: [
          {
            components: [
              { internalType: 'address', name: 'receipient', type: 'address' },
              { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
            ],
            internalType: 'struct XNFT_CoreV3.TransactionEvents',
            name: '',
            type: 'tuple',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: '_owner', type: 'address' },
          { internalType: 'address', name: '_operator', type: 'address' },
        ],
        name: 'isApprovedForAll',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: '_to', type: 'address' },
          { internalType: 'bytes32', name: '_hash', type: 'bytes32' },
          { internalType: 'bytes32[]', name: '_proof', type: 'bytes32[]' },
        ],
        name: 'mintPaidRandomToken',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: '_to', type: 'address' },
          { internalType: 'uint256', name: '_toMintID', type: 'uint256' },
          { internalType: 'bytes32[]', name: '_proof', type: 'bytes32[]' },
        ],
        name: 'mintSpecificToken',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'name',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'owner',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
        name: 'ownerOf',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'pause',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'paused',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'renounceOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'from', type: 'address' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
        ],
        name: 'safeTransferFrom',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'from', type: 'address' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
          { internalType: 'bytes', name: 'data', type: 'bytes' },
        ],
        name: 'safeTransferFrom',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'operator', type: 'address' },
          { internalType: 'bool', name: 'approved', type: 'bool' },
        ],
        name: 'setApprovalForAll',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'string', name: '_uri', type: 'string' }],
        name: 'setBaseTokenURI',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'string', name: '_uri', type: 'string' }],
        name: 'setContractURI',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'bool', name: '_isOn', type: 'bool' }],
        name: 'setIsWhiteListingOn',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'bytes32', name: '_newRoot', type: 'bytes32' },
        ],
        name: 'setMerkleRoot',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' },
        ],
        name: 'supportsInterface',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'symbol',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'uint256', name: 'index', type: 'uint256' }],
        name: 'tokenByIndex',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'owner', type: 'address' },
          { internalType: 'uint256', name: 'index', type: 'uint256' },
        ],
        name: 'tokenOfOwnerByIndex',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'uint256', name: '_tokenId', type: 'uint256' },
        ],
        name: 'tokenURI',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'totalGeneratedIDs',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'totalSupply',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        name: 'transactionEvents',
        outputs: [
          { internalType: 'address', name: 'receipient', type: 'address' },
          { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'from', type: 'address' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
        ],
        name: 'transferFrom',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'newOwner', type: 'address' },
        ],
        name: 'transferOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'unpause',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'uint256', name: 'start_', type: 'uint256' },
          { internalType: 'uint256', name: 'end_', type: 'uint256' },
        ],
        name: 'util_randomNumber',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
    ];

    const contract: Contract = this.ethersContract.create(
      process.env.MINTER_ADDRESS,
      ABI,
    );

    // console.log(await this.ethersProvider.getNetwork());

    const contractWithSigner = contract
      .connect(this.ethersProvider)
      .connect(wallet);

    this.contract = contractWithSigner;

    // this.contract.transferFrom(from, to, txHash);

    console.log(`Minter: `, await this.ethersProvider.getNetwork());

    return contractWithSigner;
  }

  async getContractAddress(): Promise<string> {
    return this.contract.address;
  }

  async mintTo(to: string, txHash: string): Promise<any> {
    // get max gas limit
    const gasLimit = await this.contract.estimateGas.mintPaidRandomToken(
      to,
      txHash,
      [],
    );

    const gasFee = await this.getFeeFromGasStation();

    // mint using max gas limit
    return this.contract.mintPaidRandomToken(to, txHash, [], {
      gasLimit: gasLimit.mul(6).div(4), // 1.5x gas limit
      maxFeePerGas: gasFee.maxFeePerGas,
      maxPriorityFeePerGas: gasFee.maxPriorityFeePerGas,
    });
  }

  async getTokenIdFromTransferEvent(tx): Promise<string> {
    // get event from transaction
    const receipt = await this.ethersProvider.getTransactionReceipt(tx.hash);
    const event = receipt.logs[0];

    // get token id from event
    const tokenId = event.topics[3];

    // convert to decimal
    const tokenIdDecimal = parseInt(tokenId, 16);

    return tokenIdDecimal.toString();
  }

  async queryNFTs(address: string) {
    if (this.nftQueryCache[address]) {
      if (this.nftQueryCache[address].expires > Date.now()) {
        return this.nftQueryCache[address].data;
      } else {
        delete this.nftQueryCache[address];
      }
    }

    const TRANSFER_EVENT_HASH =
      '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
    const TARGET_ADDRESS = address;
    const PADDED_TARGET_ADDRESS = ethers.utils
      .hexZeroPad(TARGET_ADDRESS, 32)
      .toLowerCase();

    const data = await Promise.all([
      (
        await this.contract.queryFilter({
          topics: [TRANSFER_EVENT_HASH, null, PADDED_TARGET_ADDRESS],
        })
      ).map((e) => ({ blockNumber: e.blockNumber, args: e.args })),
      (
        await this.contract.queryFilter({
          topics: [TRANSFER_EVENT_HASH, PADDED_TARGET_ADDRESS, null],
        })
      ).map((e) => ({ blockNumber: e.blockNumber, args: e.args })),
    ]);

    const eventList = [...data[0], ...data[1]];
    eventList.sort((a, b) => (a.blockNumber > b.blockNumber ? 1 : -1));

    const ownedTokens = new Set();
    // either use the current existing set or create a new one
    for (const event of eventList) {
      if (event.args.to.toLowerCase() === address.toLowerCase()) {
        ownedTokens.add(event.args.tokenId.toString());
      } else {
        ownedTokens.delete(event.args.tokenId.toString());
      }
    }
    // convert set to array
    let ownedTokensArray = [...ownedTokens];
    // console.log(ownedTokensArray);

    const contractAddress = await this.contract.address;

    ownedTokensArray = ownedTokensArray.map((tokenId) => {
      return {
        tokenid: tokenId,
        imageurl: `https://solidity.xurpasportal.com/uploads/xnft_polygon_01/images/${tokenId}.jpg`,
        contract_add: contractAddress,
      };
    });

    this.nftQueryCache[address] = {
      data: ownedTokensArray,
      expires: Date.now() + cacheExpire, // 10 minutes
    };

    return ownedTokensArray;
  }

  async getFeeFromGasStation(
    speed: 'fast' | 'standard' | 'safeLow' = 'standard',
  ): Promise<{
    maxFeePerGas: ethers.BigNumber;
    maxPriorityFeePerGas: ethers.BigNumber;
  }> {
    // get max fees from gas station
    let maxFeePerGas = ethers.BigNumber.from(40000000000); // fallback to 40 gwei
    let maxPriorityFeePerGas = ethers.BigNumber.from(40000000000); // fallback to 40 gwei

    try {
      const isProd = process.env.MINTER_ISMAINNET === 'true';

      const httpServiceResponse = this.httpService.axiosRef.get<GasPriceType>(
        isProd
          ? 'https://gasstation-mainnet.matic.network/v2'
          : 'https://gasstation-mumbai.matic.today/v2',
      );

      const { data } = await httpServiceResponse;

      maxFeePerGas = ethers.utils.parseUnits(
        Math.ceil(data[speed].maxFee) + '',
        'gwei',
      );
      maxPriorityFeePerGas = ethers.utils.parseUnits(
        Math.ceil(data[speed].maxPriorityFee) + '',
        'gwei',
      );
    } catch (err) {
      console.log('err', err);
      // ignore
    }

    return {
      maxFeePerGas,
      maxPriorityFeePerGas,
    };
  }
}
