import config from 'src/config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PinoProviderModule } from 'src/common/providers/logger/pino/provider.module';
import { CacheRedisProviderModule } from 'src/common/providers/cache/redis/provider.module';
import { PrismaProviderModule } from 'src/common/providers/database/prisma/provider.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { UserModule } from './modules/user/user.module';
import { HealthModule } from './modules/health/health.module';

@Module({
    imports: [
        // providers
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.env.${process.env.NODE_ENV}`,
            expandVariables: true,
            load: [config]
        }),
        PrismaProviderModule,
        PinoProviderModule,
        CacheRedisProviderModule,
        // controllers
        UserModule,
        HealthModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
