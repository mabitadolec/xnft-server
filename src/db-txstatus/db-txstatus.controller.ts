import { Controller, Get, Param, Query } from '@nestjs/common';
import { DbTxstatusService } from './db-txstatus.service';

@Controller('db-txstatus')
export class DbTxstatusController {
  constructor(private readonly dbTxstatusService: DbTxstatusService) {}

  @Get()
  findAll(@Query('skip') skip = 0, @Query('take') take = 25) {
    return this.dbTxstatusService.findAll({
      skip: Number(skip),
      take: Number(Math.min(take, 50)),
    });
  }

  @Get('/byId/:id')
  findOneByID(@Param('id') id: string) {
    return this.dbTxstatusService.findOne({ id: Number(id) });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dbTxstatusService.findOne({ txHash: id });
  }
}
