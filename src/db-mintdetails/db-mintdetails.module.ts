import { Module } from '@nestjs/common';
import { DbMintdetailsService } from './db-mintdetails.service';
import { DbMintdetailsController } from './db-mintdetails.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DbMintdetailsController],
  providers: [DbMintdetailsService],
  exports: [DbMintdetailsService],
})
export class DbMintdetailsModule {}
