import { Module } from '@nestjs/common';
import { PolyBurnerService } from './poly-burner.service';
import { EthersModule, MUMBAI_NETWORK } from 'nestjs-ethers';

@Module({
  imports: [
    EthersModule.forRoot({
      token: 'mumbai',
      network: MUMBAI_NETWORK,
      alchemy: 'h99Qfo8W3Y-V_sQjcH33HND4j8DvVgr9',
      useDefaultProvider: false,
    }),
  ],
  providers: [PolyBurnerService],
  exports: [PolyBurnerService],
})
export class PolyBurnerModule {}
