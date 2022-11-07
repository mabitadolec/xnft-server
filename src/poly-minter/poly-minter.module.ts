import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { EthersModule, MATIC_NETWORK } from 'nestjs-ethers';
import { PolyMinterService } from './poly-minter.service';

@Module({
  imports: [
    EthersModule.forRoot({
      token: 'matic',
      network: MATIC_NETWORK,
      alchemy: 'heNhcyBj90rGwxOUgKV3AD4IISNdh1rz',
      useDefaultProvider: false,
    }),
    HttpModule,
  ],
  providers: [PolyMinterService],
  exports: [PolyMinterService],
})
export class PolyMinterModule {}
