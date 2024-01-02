import { mail } from 'src/config/mail';
import { BullModule } from '@nestjs/bull';
import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
    imports: [
        BullModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                redis: {
                    host: configService.get('REDIS_HOST'),
                    port: parseInt(configService.get('REDIS_PORT')),
                    password: configService.get('REDIS_PASSWORD')
                }
            }),
            inject: [ConfigService]
        }),
        BullModule.registerQueue({
            name: mail.queueName
        })
    ],
    exports: [BullModule]
})
export class QueueProviderModule {}
