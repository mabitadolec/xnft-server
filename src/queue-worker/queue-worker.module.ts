import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { QueueChildMintModule } from './mint/queue-child-mint.module';
import { QueueChildTestModule } from './test/queue-child-test.module';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
      },
      defaultJobOptions: {
        removeOnComplete: 1000,
      },
    }),
    QueueChildMintModule,
    QueueChildTestModule,
  ],
})
export class QueueWorkerModule {}
