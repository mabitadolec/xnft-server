import { CacheStoreService } from '../../cache-store/cache-store.service';
import { Process, Processor } from '@nestjs/bull';
import type { Job } from 'bull';
import type { Contract } from 'nestjs-ethers';
import { PolyMinterService } from 'src/poly-minter/poly-minter.service';
import {
  MINT_QUEUE_NAME,
  MINT_QUEUE_JOBTYPES,
  MintJobDataTypes,
} from './queue-child-test.shared';
import { DbMinteventsService } from 'src/db-mintevents/db-mintevents.service';
import { DbTxstatusService } from 'src/db-txstatus/db-txstatus.service';

@Processor(MINT_QUEUE_NAME)
export class QueueChildTestProcessor {
  constructor(
    private readonly mintService: PolyMinterService,
    private readonly cacheService: CacheStoreService,

    private readonly mintEvent: DbMinteventsService,
    private readonly txService: DbTxstatusService,
  ) {}

  contract: Contract;

  @Process(MINT_QUEUE_JOBTYPES.test)
  async handleTest(job: Job<MintJobDataTypes>) {
    // await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log('doing', job.data.blockNumber);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log('minted', job.data.blockNumber);
    // console.log(this);
    setTimeout(async () => {
      // console.log(this);
      console.log('saving', job.data.blockNumber);

      await new Promise((resolve) => setTimeout(resolve, 3000));

      console.log('done', job.data.blockNumber);
    }, 3000);

    // await delay
  }
}
