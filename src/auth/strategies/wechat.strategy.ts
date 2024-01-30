import { Strategy } from 'passport-wechat';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class WechatStrategy extends PassportStrategy(Strategy, 'wechat') {
    constructor(
        private authService: AuthService,
        private configService: ConfigService
    ) {
        super({
            passReqToCallback: true,
            appID: configService.get('oauth.wechat.appId'),
            appSecret: configService.get('oauth.google.appSecret'),
            callbackURL: `${configService.get('app.globalPrefix')}/auth/wechat/callback`,
            scope: 'snsapi_userinfo'
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any): Promise<any> {
        const { unionid } = profile;
        const user = await this.authService.loginByOAuth('wechat', unionid, accessToken, refreshToken);
        return user;
    }
}
