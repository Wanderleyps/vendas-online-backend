import { CacheModule as CacheModuleNest } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';

@Module({
  imports: [
    CacheModuleNest.register({
      ttl: 18000,
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
