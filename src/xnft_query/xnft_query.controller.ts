import { Controller, Get, Param } from '@nestjs/common';
import { PolyMinterService } from 'src/poly-minter/poly-minter.service';

@Controller('xnft-query')
export class XnftQueryController {
  constructor(private readonly polyminterService: PolyMinterService) {}

  @Get(':id')
  findOne(@Param('id') address: string) {
    return this.polyminterService.queryNFTs(address);
  }
}
