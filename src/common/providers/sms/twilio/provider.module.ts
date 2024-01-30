import { Module } from '@nestjs/common';
import { TwilioModule } from 'nestjs-twilio';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        TwilioModule.forRootAsync({
            isGlobal: true,
            imports: [ConfigModule],
            useFactory: (config: ConfigService) => ({
                accountSid: config.get('sms.twilio.accountSid'),
                authToken: config.get('sms.twilio.authToken')
            }),
            inject: [ConfigService]
        })
    ]
})
export class TwilioProviderModule {}
