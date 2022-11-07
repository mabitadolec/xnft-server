import { Controller, Get, Param } from '@nestjs/common';
import { DbQueuerequestsService } from './db-queuerequests.service';

@Controller('db-queuerequests')
export class DbQueuerequestsController {
  constructor(
    private readonly dbQueuerequestsService: DbQueuerequestsService,
  ) {}

  @Get()
  findAll() {
    return this.dbQueuerequestsService.findAll({});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dbQueuerequestsService.findOne({ id: Number(id) });
  }
}
