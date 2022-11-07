import { Module } from '@nestjs/common';
import { XnftQueryController } from './xnft_query.controller';
import { PolyMinterModule } from 'src/poly-minter/poly-minter.module';

@Module({
  imports: [PolyMinterModule],
  controllers: [XnftQueryController],
})
export class XnftQueryModule {}
