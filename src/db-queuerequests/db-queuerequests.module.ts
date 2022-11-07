import { Module } from '@nestjs/common';
import { DbQueuerequestsService } from './db-queuerequests.service';
import { DbQueuerequestsController } from './db-queuerequests.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DbQueuerequestsController],
  providers: [DbQueuerequestsService],
  exports: [DbQueuerequestsService],
})
export class DbQueuerequestsModule {}
