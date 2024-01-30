import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private authService: AuthService,
        private configService: ConfigService
    ) {
        super({
            passReqToCallback: true,
            clientID: configService.get('oauth.google.clientId'),
            clientSecret: configService.get('oauth.google.clientSecret'),
            callbackURL: `${configService.get('app.globalPrefix')}/auth/google/callback`,
            scope: ['email', 'profile']
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any): Promise<any> {
        const { id, name, emails, photos } = profile;
        const user = await this.authService.loginByOAuth('google', id, accessToken, refreshToken);
        return user;
    }
}
