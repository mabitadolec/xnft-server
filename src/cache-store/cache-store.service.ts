import { Injectable } from '@nestjs/common';
import type { Cache } from 'cache-manager';
import { Inject, CACHE_MANAGER } from '@nestjs/common';

@Injectable()
export class CacheStoreService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getLastCheckedTransactionNumber() {
    const number =
      (await this.cacheManager.get('lastCheckedTransactionNumber')) || 0;
    return Number(number);
  }

  async setLastCheckedTransactionNumber(number: number) {
    const lastNumber = await this.getLastCheckedTransactionNumber();
    if (lastNumber < number) {
      await this.cacheManager.set('lastCheckedTransactionNumber', number, {
        ttl: 0,
      });
    }
  }

  async getMintedTokensOfAddress(contract:string, address: string) {
    const number = (await this.cacheManager.get(`minted::${contract}::${address}`)) || 0;
    return Number(number);
  }

  async incrementTokensOfAddress(contract:string, address: string) {
    const number = await this.getMintedTokensOfAddress(contract, address);
    await this.cacheManager.set(`minted::${contract}::${address}`, number + 1, {
      ttl: 0,
    });
    
  }
}
