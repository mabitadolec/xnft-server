import { Injectable } from '@nestjs/common';
import {
  InjectEthersProvider,
  InjectSignerProvider,
  InjectContractProvider,
  BaseProvider,
  Network,
  Wallet,
  EthersSigner,
  EthersContract,
  Contract,
  BigNumber,
} from 'nestjs-ethers';
import { Event } from 'ethers';

@Injectable()
export class PolyBurnerService {
  contract: Contract;

  constructor(
    @InjectEthersProvider('mumbai')
    private readonly ethersProvider: BaseProvider,

    @InjectSignerProvider('mumbai')
    private readonly signer: EthersSigner,

    @InjectContractProvider('mumbai')
    private readonly ethersContract: EthersContract,
  ) {}

  async onModuleInit() {
    await this.bootStrapContract();
  }

  async bootStrapContract(): Promise<Contract> {
    const wallet: Wallet = this.signer.createWallet(
      process.env.BURNER_INTERACTOR_PK,
    );

    const ABI = [
      {
        inputs: [
          {
            internalType: 'contract IXToken_Core',
            name: '_xtoken_Core',
            type: 'address',
          },
          {
            internalType: 'address',
            name: '_targetNFTAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: '_targetNFTNetwork',
            type: 'uint256',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'address',
            name: 'Address',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'Timestamp',
            type: 'uint256',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'Amount',
            type: 'uint256',
          },
        ],
        name: 'MintEvent',
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
        inputs: [],
        name: 'mintPrice',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'owner',
        outputs: [
          {
            internalType: 'address',
            name: '',
            type: 'address',
          },
        ],
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
          {
            internalType: 'uint256',
            name: '_tokenAmount',
            type: 'uint256',
          },
        ],
        name: 'setMintPrice',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: '_newNftAddress',
            type: 'address',
          },
        ],
        name: 'setTargetNftAddress',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'uint256',
            name: '_newNftNetwork',
            type: 'uint256',
          },
        ],
        name: 'setTargetNftNetwork',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: '_newXTokenCoreAddress',
            type: 'address',
          },
        ],
        name: 'setXTokenCore',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'targetNFTAddress',
        outputs: [
          {
            internalType: 'address',
            name: '',
            type: 'address',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'targetNFTNetwork',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: '_ownerAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: '_tokenAmount',
            type: 'uint256',
          },
        ],
        name: 'tokenBurner',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'newOwner',
            type: 'address',
          },
        ],
        name: 'transferOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'xtoken_Core',
        outputs: [
          {
            internalType: 'contract IXToken_Core',
            name: '',
            type: 'address',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
    ];

    const contract: Contract = this.ethersContract.create(
      process.env.BURNER_ADDRESS,
      ABI,
    );

    const contractWithSigner = contract.connect(wallet);

    this.contract = contractWithSigner;

    console.log(`Burner: `, await this.ethersProvider.getNetwork());

    return contractWithSigner;
  }

  async getEvents(from: number, to?: number | 'latest'): Promise<Event[]> {
    // get events
    const events = await this.contract.queryFilter('MintEvent', from, to);

    return events;
  }

  async check(): Promise<Network> {
    return this.ethersProvider.getNetwork();
  }

  async createListener(
    listenTo: string | null,
    onMintEvent: (
      address: string,
      timestamp: number,
      amount: BigNumber,
      event,
    ) => Promise<void>,
  ): Promise<void> {
    this.contract.on(listenTo || 'MintEvent', onMintEvent);
  }
}
