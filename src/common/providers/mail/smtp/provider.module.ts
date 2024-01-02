import { Module, Global } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailService } from './mail.service';
import { MailProcessor } from './mail.processor';

@Global()
@Module({
    imports: [
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                transport: {
                    host: configService.get('mail.host'),
                    port: configService.get('mail.port'),
                    secure: configService.get('mail.secure'),
                    ignoreTLS: configService.get('mail.ignoreTLS'),
                    auth: {
                        user: configService.get('mail.user'),
                        pass: configService.get('mail.pass')
                    }
                },
                defaults: {
                    from: `"${configService.get('mail.from')}" <${
                        configService.get('mail.fromMail')
                    }>`
                },
                template: {
                    dir: __dirname + '/templates',
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true
                    }
                },
                preview: !configService.get('app.isProduction')
            }),
            inject: [ConfigService]
        })
    ],
    providers: [MailService, MailProcessor],
    exports: [MailService]
})
export class SmtpMailModule {}
