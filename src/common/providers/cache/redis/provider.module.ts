import { Module, Global } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheService } from './cache.service';

@Global()
@Module({
    imports: [
        CacheModule.registerAsync({
            // isGlobal: true,
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                ttl: 5000,
                store: redisStore,
                socket: {
                    host: configService.get('REDIS_HOST'),
                    port: parseInt(configService.get('REDIS_PORT'))
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
