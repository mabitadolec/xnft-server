import { Module } from '@nestjs/common';
import { DbMinteventsService } from './db-mintevents.service';
import { DbMinteventsController } from './db-mintevents.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DbMinteventsController],
  providers: [DbMinteventsService],
  exports: [DbMinteventsService],
})
export class DbMinteventsModule {}
