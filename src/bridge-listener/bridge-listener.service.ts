import { DbMintdetailsService } from './../db-mintdetails/db-mintdetails.service';
import { Injectable } from '@nestjs/common';
import { BigNumber } from 'nestjs-ethers';

import { CacheStoreService } from 'src/cache-store/cache-store.service';
import { PolyBurnerService } from 'src/poly-burner/poly-burner.service';
import { QueueChildMintService } from 'src/queue-worker/mint/queue-child-mint.service';

import { DbQueuerequestsService } from 'src/db-queuerequests/db-queuerequests.service';
import { DbTxstatusService } from 'src/db-txstatus/db-txstatus.service';

@Injectable()
export class BridgeListenerService {
  constructor(
    private readonly mintQueue: QueueChildMintService,
    private readonly polyBurner: PolyBurnerService,
    private readonly cache: CacheStoreService,
    private readonly queueService: DbQueuerequestsService,
    private readonly txService: DbTxstatusService,
    private readonly DbMintdetailsService: DbMintdetailsService,
  ) {}

  async onModuleInit() {
    const lastBlockNumber = await this.cache.getLastCheckedTransactionNumber();

    const getTransactions = await this.polyBurner.getEvents(
      lastBlockNumber,
      'latest',
    );

    // console.log('lastBlockNumber', lastBlockNumber);
    // console.log('getTransactions', getTransactions);

    if (getTransactions.length > 0) {
      // get latest blockNumber
      const lastBN = getTransactions.at(-1).blockNumber;

      // set cachd blockNumber
      await this.cache.setLastCheckedTransactionNumber(lastBN);

      // For each transaction, add to queue
      getTransactions.map((tx) => {
        this.onMint(tx.args.Address, tx.args.Timestamp, tx.args.Amount, tx);
      });
    }

    // Start Listener
    this.polyBurner.createListener(null, this.onMint.bind(this));
  }

  async onMint(
    address: string,
    timestamp: number,
    amount: BigNumber,
    event: any,
  ) {
    // check record on database about this transaction
    /*
    const maxTokenPerWaitlist = 1;
    const whiteList = [
      '0xe3B06892E665A73bbd1Ff4A3eee706b56B202BE2',
      '0xcd6AA93cb88009a12fA7f702674a72c984B8F651',
      '0x5b044567682e1AA8812b68985c834c43EF8c095d',
      '0x1de263ab68e9Ee674421C88733D4b7FFA62b20cB',
      '0x415C0B60716ed6bD310f63ba2347EFe1ad94f399',
      '0xE10d2be9e756C07a249e7d8D89D23c1F2056087F',
      '0x2a2E9b58238f2b8BfeDBa3123E3e6dEf8c258Aa6',
      '0xD23EDD6Ca8f1F020760D07B84A0B3f306c9CA004',
      '0x3f27abb1a2b3eea5590D37F6112Aa467efB0B44a',
      '0xe670f62DA49479F26505f85A2F021DD8018fD57E',
      '0xb385b4366654Ea87eAE11C3dF96d4baa37AbF428',
      '0xA38629d39dEC8a99881C6784Ee0BE09dD5Bf3099',
      '0xb1674fcaBa8E620A14C9D52F153d477B5A1299fb',
      '0x145112a83296EF57409bbd77C822Dd50DB4C0cCF',
      '0x0079f6B27ac2c71E97274Bc388955E0d30211805',
      '0x3fDc905B573A2B407d2C46dA75e21c46b7FA8db2',
      '0x027d028aBa2917AB59623878d6012f9893D48123',
      '0x5BCf001d0C1f22a5B94D9ED610faA655ebFCEf43',
      '0xc17F3FcE8E0f23F98aF3cC780b21Fb86822dAF35',
      '0x54102e9a8e576110dD2cAE0B469d7246B9B372B5',
      '0x655aFF0c69fc2B638877b965e2C7613820C3c8E6',
      '0xBEe94A6b5715aCfd025fe5dD91A6C814087DA87A',
      '0x7f75B1B7cb4a8F79910479BdcAd5a7e2B973E9D1',
      '0xFC4D36CCC35610379Ac954104A8939f597E89f4E',
      '0x07B547ae434314432B314F8b770429774bED3752',
      '0xaF146B75cf88B7F3C502E90a7bC6D9EaD97b692e',
      '0xb0507bF081cE34a3bFa4ec32D93F21d55a302684',
      '0x2fF9A7fa30385543D442968E2EE627ACB6DfBfCe',
      '0xc07e405FE6A900661057382e6FB2588Ba152a43A',
      '0x07217268044E23124B2168b9550AA39A95a537f4',
      '0xE98Af72a92eb0C8Ea4385CeF2D7c2D81b0298e54',
      '0xc00dA48b3feb2D9172f970c919F1Eb001Bc413Ef',
      '0xc7d08AbB3c555a3743ECcd9Af71F06e8e5157Ff9',
      '0xa4504eDec2205103800670Ae2d24679ae70F46ef',
      '0xE5861e7e3873C34914B26Aac236d5f474A6cfE86',
      '0xf1455E308de9C709aa6e106D7B989aF146B49D5F',
      '0xdf334E69D6cd02EaC1f1198B73B333335E3D85fc',
      '0x38b29776b160FEd5d483E9f9F4cb72B473124c5f',
      '0x2b7075f28c7e3A44e550443fC2bDB771Acf66Df1',
      '0x027262b38282B10b105b2D3a3729d0499982AfD4',
      '0xDF9daeE799463F98133bb5Be1b30B810deed8A4a',
      '0x13C882cDcc3Bd7f3180b2083E47125199C9bCe80',
      '0xc8aedF1877BE9e7E220BEF20db12c9Bd2753E0e0',
      '0x07E5c216fA0BC27D8dEfE3bb0FCD9803ab8A71F0',
      '0x8924bFe2Cc4a968D5F6214c350906091E780F762',
      '0xf920aF9F2698F7Db7eAb1F2e6A89B8D1D689621D',
      '0xfB7Eb09320094d16439b5710738c485C8d31D928',
      '0xc27710Dd0c61B4FaA0257fD225b8d745bb9eEBd0',
      '0xc6a2Cf914d1EcF80d832D9f735829e3c6442b81c',
      '0xE148d81B26C64F7cA541BF0E1f958AFbE54BaA78',
      '0x7dccB7B3f8Af51f3dD688C937F2cDB09806783Ac',
      '0x85Bc56864cD9c62d2F7de6c3834Da4213414b453',
      '0x12a5079c78D872717fBfd8481b42D1e680AA3F60',
      '0xAfC7DDDa7f5806edc978E08e6e6F1a774e789a9D',
      '0xa8d820787e3E96ba0eBba1f0fDbaE4De237026fc',
      '0x670B783f3bac6f39fEf7bB28aC564CF156e3971f',
      '0x24AFCb9b5e8a96c3a7634660eFf3D2984515aC2a',
      '0x91380E7fd96BB4e3F0d23afbc38351751512c8F1',
      '0xa4a4665A93cf73e2fCE9aFcFB13e5BA1f400009B',
      '0x18ee4D98aFF62e99535A52c2A3Fc2855092A1b51',
      '0xD98c7C138e31ed2B77f98922F84DC6Caa6daE419',
      '0xa01F67BC3C4f9ca160Ce2D7ad3feeAb4B1e8a797',
      '0xb5Cd4647B5c01a7d1D86172D4394eF96B63743A8',
      '0x5f3c937311948FfF716419812E83F569d43A5BdC',
      '0x1abc1d113aFE89cA8e2745271574D7F00e3eEDFf',
      '0x4B12cfdF7442390bE051e2DA45623D485E7923cc',
      '0xfAcD16535C83A31a6048Cb003E478cd90d09A19E',
      '0xd668Ec8D8EDc54bEF754D087d18E50FdfD49eCd6',
      '0x1a85569a1496eAf4683598f5477335261BeBe7f3',
      '0xd51B9eA2f6D2Eb893efBd41DDfe0A9d236DbeCcD',
      '0xF6FFf024E32548C2Eb4F382AEedEc8c8dc9CF922',
      '0x6d80FeCDa03EFBaD2c27aB13f9C57236F255B41f',
      '0x8F87b09E294F01819217D77A12244a3073e917c3',
      '0xD782066dc7304f953905e33149492f0238ac0612',
      '0xe4fF46A52C6AB99D4b743Da3A5f4d084161E8dB8',
      '0x49710BeCb5B27698b16264f6A0b8c96Ac6a739D7',
      '0xa57e3Ad8D529cD75b94d56122AC8320ff00c179b',
      '0x626968d00Fce0B59b5a806470D2272a632397aDB',
      '0xF0E912F17e947091f0E91f814Ed929fc0dDa5440',
      '0x1E383e4ac0b8157167644a3Fd9d7dE597638B8D1',
      '0x6051A458B8b5E5B48E2f57e6f9a8A22b5be760b8',
      '0x5bF911833b0249347FF39C5e023f594C1A611BCB',
      '0xcBba4bb54F725D86c8c9a6eA198A17Cb3b7833f3',
      '0xFE994db611FCA9a0dd87A76eD90076c3a040D9f5',
      '0x623638f259c749C6bE60b5cE3589c01FE677f127',
      '0xBAe9a9b580586c566a9291c2727EF6F6105dcf5E',
      '0x34705eAE5d7cCcF3ACf24fC1608e71dBe53CF467',
      '0x6CC53BF4d2F4b29c9717E38E52e3214dcbfD6387',
      '0xd2531F4F9F9de46b429001e2ef27B551d9362Dc9',
      '0xC8570F4959f490D5DdCe41D6CA6499493effe84e',
      '0xa51CE63241082964ED9C9f3a4109066C2c0A88cd',
      '0x331103b30B756Cf2312c95cc199dd10E57Bcac9f',
      '0x7D2B66A94D823eF498f3584eF3eF46869C452dbC',
      '0x67bc6FaACf4B49612648E7aE5D75fEb7f7F59C89',
      '0x85bb5A77292bEdd43167C0A12A8885f48D2783D7',
      '0x8c9538172669549DD302688031d96e22c766DA37',
      '0x91181F619b5f5FbD3694Bfc6cfc68683Bd7ccD8a',
      '0x387F7590cc1Da3baA1a51132160EaDb58Da63AC6',
      '0xc9e346A99554f3E2b1985be71b5D1b8638324e31',
      '0x7F179Cee7b38F393e8D8280d0E8B3df8b0DDC32f',
      '0x070842D64Fa9481bd1dddDE061493935063B749A',
      '0x1589C2F3b260121d2dBc8acCEB32c8ce951D06C7',
      '0x162d10d822b75187961a56CD0103fb851fD0ACeb',
      '0xf01330D46743fA5EFf47c6C1fD4A713966a60A39',
      '0x13E6f88202d14F2A5F446A0c1fE4544C714B5e2E',
      '0x5b9251DE4057852eA6E06BDaCA25a71c8aBE08CA',
      '0x376140dc96cba80a586b3B79ae5a99C4139260C1',
      '0x6D6563584cBB445f3e7F307AEA145EFa26602ACA',
      '0x32c593A98caE41Ee29774f21BAeB972B6f6B5815',
      '0xa3f592985526C265A1d99A6972B1612e740849ae',
      '0xDE22Fc8F28d7871502C0eb6526a78c69c0E06d84',
      '0xED8C00e1da2c0E62DFf80B5789d1930c9CF736Bd',
      '0xf148e19baeAc2153d19D4c9301f5BCE40A53A04b',
      '0xD1c6E785a0124Fc0434a848c0C945bd51CAb5e9f',
      '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      '0x4958E2aFb082e5e40ECC5F43433F48805bCa287E',
      '0xb87B0542516741DBFC6C21Cb728964668EE7d7a5',
      '0x5A73b02DfC52f8a3cBcAfbD709E89B32EddeA9AD',
      '0xF4B9dcc6a58734b4CD830c8C49AC6dd6392a0f11',
      '0xa7159c69eEd75C86f1fE839A35C6964A1262AcE4',
      '0x32B63A8cBC9A862D0f324650dc9e835BEF6C475e',
      '0x64D88dE488289e729be7371E2b92504b0bc88751',
      '0xFDBf9B71c958F9B65cb5fee0CAA40404FDd8a8b3',
    ].map((a) => a.toLowerCase());

    // check whitelist if not in whitelist, dont continue
    if (!whiteList.includes(address.toLowerCase())) {
      console.log('not in whitelist', address);
      return;
    }

    // check how many they minted
    const minted = await this.cache.getMintedTokensOfAddress(
      event.address,
      address,
    );

    // if minted is more than maxTokenPerWaitlist, dont continue
    if (minted >= maxTokenPerWaitlist) {
      console.log(
        `address ${address} already minted ${minted} tokens, max is ${maxTokenPerWaitlist}`,
      );
      return;
    }
    */

    const doesExist = await this.queueService.exists({
      txHash: event.transactionHash,
    });

    if (doesExist) {
      console.log('Transaction already exists');
      return;
    }

    // create record
    const createRX = await this.queueService.create({
      txHash: event.transactionHash,
      data: event,
      status: '',
      burnerContract: event.address,
    });

    if (!createRX) {
      console.log('Error creating record');
      console.log(event.transactionHash);
      return;
    }

    // create txStatus record
    await this.txService.create({
      txHash: event.transactionHash,
      burnTXHash: event.transactionHash,
      status: 'pending',
    });

    await await this.mintQueue.transcode({
      address,
      amount: amount.toString(),
      transactionHash: event.transactionHash,
      blockNumber: event.blockNumber,
    });
  }
}
