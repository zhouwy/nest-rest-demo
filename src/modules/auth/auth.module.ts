import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { SessionSerializer } from './session.serializer';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthenticatedGuard } from './guards/authenticated.gurad';

@Module({
    imports: [
        PassportModule.register({
            session: true
        }),
        UserModule
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        LocalStrategy,
        SessionSerializer,
        {
            provide: APP_GUARD,
            useClass: AuthenticatedGuard
        }
    ]
})
export class AuthModule {}
