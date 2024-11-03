import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getCache<T>(
    key: string,
    functionRequest: () => Promise<T>,
  ): Promise<T> {
    const allCacheData: T = await this.cacheManager.get(key);

    if (allCacheData) {
      return allCacheData;
    }

    const allData: T = await functionRequest();

    await this.cacheManager.set(key, allData);

    return allData;
  }
}
