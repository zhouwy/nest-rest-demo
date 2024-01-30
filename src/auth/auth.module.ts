import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { UserService } from 'src/modules/user/user.service';
import { CaslFactory } from './casl.factory';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SessionSerializer } from './session.serializer';
import { AuthenticatedGuard } from './guards/authenticated.gurad';
import { LocalStrategy, SmsOtpStrategy, GoogleStrategy } from './strategies';

@Module({
    imports: [
        PassportModule.register({
            session: true
        })
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        UserService,
        LocalStrategy,
        SmsOtpStrategy,
        GoogleStrategy,
        SessionSerializer,
        CaslFactory,
        {
            provide: APP_GUARD,
            useClass: AuthenticatedGuard
        }
    ]
})
export class AuthModule {}
