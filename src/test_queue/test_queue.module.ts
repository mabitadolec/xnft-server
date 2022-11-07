import { Module } from '@nestjs/common';
import { QueueChildTestModule } from 'src/queue-worker/test/queue-child-test.module';
import { TestQueueController } from './test_queue.controller';

@Module({
  imports: [QueueChildTestModule],
  controllers: [TestQueueController],
})
export class TestQueueModule {}
