import { Controller, Get, Param } from '@nestjs/common';
import { DbMintdetailsService } from './db-mintdetails.service';

@Controller('db-mintdetails')
export class DbMintdetailsController {
  constructor(private readonly dbMintdetailsService: DbMintdetailsService) {}

  @Get()
  findAll() {
    return this.dbMintdetailsService.findAll({});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dbMintdetailsService.findOne({ id });
  }
}
