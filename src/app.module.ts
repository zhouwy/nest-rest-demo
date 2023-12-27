import config from 'src/config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PinoProviderModule } from 'src/common/providers/logger/pino/provider.module';
import { PrismaProviderModule } from 'src/common/providers/database/prisma/provider.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { UserModule } from './modules/user/user.module';

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
        // controllers
        UserModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
