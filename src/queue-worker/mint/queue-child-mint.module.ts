import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { CacheStoreModule } from 'src/cache-store/cache-store.module';
import { DbMinteventsModule } from 'src/db-mintevents/db-mintevents.module';
import { DbQueuerequestsModule } from 'src/db-queuerequests/db-queuerequests.module';
import { DbTxstatusModule } from 'src/db-txstatus/db-txstatus.module';
import { PolyMinterModule } from 'src/poly-minter/poly-minter.module';
import { QueueChildMintProcessor } from './queue-child-mint.processor';
import { MINT_QUEUE_NAME } from './queue-child-mint.shared';
import { QueueChildMintService } from './queue-child-mint.service';
import { DbMintdetailsModule } from 'src/db-mintdetails/db-mintdetails.module';

@Module({
  imports: [
    CacheStoreModule,
    DbMinteventsModule,
    DbQueuerequestsModule,
    DbTxstatusModule,
    DbMintdetailsModule,
    PolyMinterModule,
    BullModule.registerQueue({
      name: MINT_QUEUE_NAME,
    }),
  ],
  providers: [QueueChildMintProcessor, QueueChildMintService],
  exports: [QueueChildMintService],
})
export class QueueChildMintModule {}
