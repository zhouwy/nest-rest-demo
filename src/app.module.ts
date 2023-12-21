import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaProviderModule } from 'src/common/providers/database/prisma/provider.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { UserModule } from './modules/user/user.module';
import configuration from './config/configuration';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.env.${process.env.NODE_ENV}`,
            expandVariables: true,
            load: [configuration]
        }),
        PrismaProviderModule,
        UserModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
