import { Controller, Get, Param } from '@nestjs/common';
import { DbMinteventsService } from './db-mintevents.service';

@Controller('db-mintevents')
export class DbMinteventsController {
  constructor(private readonly dbMinteventsService: DbMinteventsService) {}

  @Get()
  findAll() {
    return this.dbMinteventsService.findAll({});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dbMinteventsService.findOne({ id: Number(id) });
  }
}
