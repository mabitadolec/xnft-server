import {
  MintJobDataTypes,
  MINT_QUEUE_JOBTYPES,
  MINT_QUEUE_NAME,
} from './queue-child-mint.shared';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class QueueChildMintService {
  constructor(
    @InjectQueue(MINT_QUEUE_NAME) private readonly mintQueue: Queue,
  ) {}

  async transcode(data: MintJobDataTypes) {
    await this.mintQueue.add(MINT_QUEUE_JOBTYPES.mint, data);
  }
}
