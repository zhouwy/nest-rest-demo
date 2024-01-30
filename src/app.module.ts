import config from 'src/config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SmtpMailModule } from 'src/common/providers/mail/smtp/provider.module';
import { PinoProviderModule } from 'src/common/providers/logger/pino/provider.module';
import { QueueProviderModule } from 'src/common/providers/queue/redis/provider.module';
import { TwilioProviderModule } from 'src/common/providers/sms/twilio/provider.module';
import { CacheRedisProviderModule } from 'src/common/providers/cache/redis/provider.module';
import { PrismaProviderModule } from 'src/common/providers/database/prisma/provider.module';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
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
        PinoProviderModule,
        PrismaProviderModule,
        CacheRedisProviderModule,
        QueueProviderModule,
        SmtpMailModule,
        TwilioProviderModule,
        // controllers
        AuthModule,
        HealthModule,
        UserModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
