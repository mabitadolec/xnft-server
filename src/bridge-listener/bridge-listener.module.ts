import { PolyBurnerModule } from './../poly-burner/poly-burner.module';
import { Module } from '@nestjs/common';
import { BridgeListenerService } from './bridge-listener.service';
import { QueueChildMintModule } from 'src/queue-worker/mint/queue-child-mint.module';
import { CacheStoreModule } from 'src/cache-store/cache-store.module';
import { DbQueuerequestsModule } from 'src/db-queuerequests/db-queuerequests.module';
import { DbTxstatusModule } from 'src/db-txstatus/db-txstatus.module';
import { DbMintdetailsModule } from 'src/db-mintdetails/db-mintdetails.module';

@Module({
  imports: [
    CacheStoreModule,
    PolyBurnerModule,
    QueueChildMintModule,
    DbQueuerequestsModule,
    DbTxstatusModule,
    DbMintdetailsModule,
  ],
  providers: [BridgeListenerService],
})
export class BridgeListenerModule {}
