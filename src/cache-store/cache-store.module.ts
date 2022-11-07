import { CacheModule, Module } from '@nestjs/common';
import { CacheStoreService } from './cache-store.service';

import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      // Store-specific configuration:
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
    }),
  ],
  providers: [CacheStoreService],
  exports: [CacheStoreService],
})
export class CacheStoreModule {}
