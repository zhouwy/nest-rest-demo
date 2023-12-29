// import { APP_INTERCEPTOR } from '@nestjs/core';
import { Module, Global } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-yet';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule, CacheInterceptor } from '@nestjs/cache-manager';
import { CacheService } from './cache.service';

@Global()
@Module({
    imports: [
        CacheModule.registerAsync({
            // isGlobal: true,
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                ttl: 5000,
                store: redisStore,
                socket: {
                    url: configService.get('REDIS_URL')
                    // host: configService.get('REDIS_HOST'),
                    // port: parseInt(configService.get('REDIS_PORT'))
                }
            }),
            inject: [ConfigService]
        })
    ],
    providers: [
        CacheService,
        // {
        //     provide: APP_INTERCEPTOR,
        //     useClass: CacheInterceptor
        // }
    ],
    exports: [CacheService]
})
export class CacheRedisProviderModule {}
