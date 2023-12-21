import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [
        PrismaModule.forRootAsync({
            isGlobal: true,
            useFactory: async (configService: ConfigService) => {
                return {
                    prismaOptions: {
                        datasourceUrl: configService.get('DATABASE_URL')
                    },
                    explicitConnect: true
                };
            },
            inject: [ConfigService]
        })
    ]
})
export class PrismaProviderModule {}
