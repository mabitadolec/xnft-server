import { Module } from '@nestjs/common';
import { PolyBurnerModule } from './poly-burner/poly-burner.module';
import { BridgeListenerModule } from './bridge-listener/bridge-listener.module';
import { QueueWorkerModule } from './queue-worker/queue-worker.module';
import { DbQueuerequestsModule } from './db-queuerequests/db-queuerequests.module';
import { DbMinteventsModule } from './db-mintevents/db-mintevents.module';
import { DbTxstatusModule } from './db-txstatus/db-txstatus.module';
import { TxstatusModule } from './txstatus/txstatus.module';
import { XnftQueryModule } from './xnft_query/xnft_query.module';
import { TestQueueModule } from './test_queue/test_queue.module';
import { DbMintdetailsModule } from './db-mintdetails/db-mintdetails.module';

@Module({
  imports: [
    PolyBurnerModule,
    BridgeListenerModule,
    QueueWorkerModule,
    DbQueuerequestsModule,
    DbMinteventsModule,
    DbTxstatusModule,
    TxstatusModule,
    XnftQueryModule,
    TestQueueModule,
    DbMintdetailsModule,
  ],
})
export class AppModule {}
