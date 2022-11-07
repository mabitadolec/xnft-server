import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { CacheStoreModule } from 'src/cache-store/cache-store.module';
import { DbMinteventsModule } from 'src/db-mintevents/db-mintevents.module';
import { DbQueuerequestsModule } from 'src/db-queuerequests/db-queuerequests.module';
import { DbTxstatusModule } from 'src/db-txstatus/db-txstatus.module';
import { PolyMinterModule } from 'src/poly-minter/poly-minter.module';
import { QueueChildTestProcessor } from './queue-child-test.processor';
import { QueueChildTestService } from './queue-child-test.service';
import { MINT_QUEUE_NAME } from './queue-child-test.shared';

@Module({
  imports: [
    CacheStoreModule,
    DbMinteventsModule,
    DbQueuerequestsModule,
    DbTxstatusModule,
    PolyMinterModule,
    BullModule.registerQueue({
      name: MINT_QUEUE_NAME,
    }),
  ],
  providers: [QueueChildTestProcessor, QueueChildTestService],
  exports: [QueueChildTestService],
})
export class QueueChildTestModule {}
