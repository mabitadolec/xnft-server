import { CacheStoreService } from './../../cache-store/cache-store.service';
import { Process, Processor } from '@nestjs/bull';
import type { Job } from 'bull';
import type { Contract } from 'nestjs-ethers';
import { PolyMinterService } from 'src/poly-minter/poly-minter.service';
import {
  MINT_QUEUE_NAME,
  MINT_QUEUE_JOBTYPES,
  MintJobDataTypes,
} from './queue-child-mint.shared';
import { DbMinteventsService } from 'src/db-mintevents/db-mintevents.service';
import { DbTxstatusService } from 'src/db-txstatus/db-txstatus.service';
import { DbMintdetailsService } from 'src/db-mintdetails/db-mintdetails.service';

@Processor(MINT_QUEUE_NAME)
export class QueueChildMintProcessor {
  constructor(
    private readonly mintService: PolyMinterService,
    private readonly cacheService: CacheStoreService,

    private readonly mintEvent: DbMinteventsService,
    private readonly txService: DbTxstatusService,
    private readonly mintDetail: DbMintdetailsService,
  ) {}

  contract: Contract;

  @Process(MINT_QUEUE_JOBTYPES.mint)
  async handleTranscode(job: Job<MintJobDataTypes>) {
    try {
      // do the checking and validation here
      // console.log(
      //   `${job.data.transactionHash} - ${job.data.address}  ${job.data.amount}`,
      // );

      const isMinted = await this.mintEvent.exists({
        burntxHash: job.data.transactionHash,
      });

      if (isMinted) {
        console.log('already minted');
        return;
      }

      // if all is good, then call the minting service
      job.progress(20);

      const tx = await this.mintService.mintTo(
        job.data.address,
        job.data.transactionHash,
      );
      // console.log(tx);

      console.log(
        `Minted to: ${job.data.address} [${job.data.transactionHash}]`,
      );

      await this.txService.update({
        where: { txHash: job.data.transactionHash },
        data: {
          mintTXHash: tx.hash,
        },
      });

      await this.cacheService.setLastCheckedTransactionNumber(
        job.data.blockNumber,
      );

      await this.mintDetail.create({
        id: tx.hash,
        gas_maxFeePerGas: tx.maxFeePerGas.toString(),
        gas_maxPriorityFeePerGas: tx.maxPriorityFeePerGas.toString(),
        gas_gasLimit: tx.gasLimit.toString(),
        gas_nonce: tx.nonce.toString(),
        input_to: job.data.address,
        input_hash: job.data.transactionHash,
        input_proof: '[]',
      });

      (async () => {
        await tx.wait();

        // get minted token from transaciton
        const tokenId = await this.mintService.getTokenIdFromTransferEvent(tx);

        // console.log('tokenID', tokenId);

        await this.mintEvent.create({
          burntxHash: job.data.transactionHash,
          txHash: tx.hash,
          nftContract: await this.mintService.getContractAddress(),
          receiver: job.data.address,
          status: 'done',
          tokenID: tokenId,
          data: job.data,
        });

        await this.txService.update({
          where: { txHash: job.data.transactionHash },
          data: {
            mintedToken: tokenId,
            status: 'done',
          },
        });
        job.progress(100);

        job.finished();
      })();
    } catch (error) {
      console.log(error);
    }
  }
}
