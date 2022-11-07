import { Module } from '@nestjs/common';
import { DbTxstatusService } from './db-txstatus.service';
import { DbTxstatusController } from './db-txstatus.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DbTxstatusController],
  providers: [DbTxstatusService],
  exports: [DbTxstatusService],
})
export class DbTxstatusModule {}
