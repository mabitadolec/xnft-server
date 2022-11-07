import { Module } from '@nestjs/common';
import { TxstatusGateway } from './txstatus.gateway';
import { DbTxstatusModule } from 'src/db-txstatus/db-txstatus.module';

@Module({
  imports: [DbTxstatusModule],
  providers: [TxstatusGateway],
})
export class TxstatusModule {}
