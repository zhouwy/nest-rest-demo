import { Cache } from 'cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CacheService {
    constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

    async get<T>(key: string) {
        return this.cacheManager.get(key);
    }
    async set(key: string, value: any, ttl?: number) {
        return this.cacheManager.set(key, value, ttl);
    }
}
