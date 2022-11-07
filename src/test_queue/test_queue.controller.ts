import { Controller, Get } from '@nestjs/common';
import { QueueChildTestService } from 'src/queue-worker/test/queue-child-test.service';

@Controller('test-queue')
export class TestQueueController {
  integer: number;
  constructor(private readonly queueChildService: QueueChildTestService) {
    this.integer = 0;
  }

  @Get()
  async findOne() {
    await this.queueChildService.transcodeTest({
      address: '0x0000000000000000000000000000000000000000',
      amount: '0',
      transactionHash:
        '0x0000000000000000000000000000000000000000000000000000000000000000',
      blockNumber: this.integer++,
    });
    return 'done';
  }
}
