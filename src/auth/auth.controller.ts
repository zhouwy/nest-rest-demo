import { promisify } from 'util';
import { Response } from 'express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Body, Controller, Post, Get, Req, Res, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { RegisterUserDto, SendSmsCodeDto } from './dto';
import { LocalAuthGuard, SmsOtpAuthGuard, GoogleOAuthGuard, WechatOAuthGuard } from './guards';

@Public()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({ summary: '注册新用户'})
    @Post('register')
    async register(@Body() registerDto: RegisterUserDto) {
        return this.authService.createWithEmailAndPassword(registerDto);
    }

    @ApiOperation({ summary: '邮箱/密码登录'})
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Req() req) {
        return req.user;
    }

    @ApiOperation({ summary: '发送短信验证码'})
    @Post('sms/code')
    async sendSmsCode(@Body() sendSmsCodeDto: SendSmsCodeDto) {
        return this.authService.sendOtpBySms(sendSmsCodeDto.phone);
    }

    @ApiOperation({ summary: '短信验证码登录'})
    @UseGuards(SmsOtpAuthGuard)
    @Post('sms/login')
    async smsLogin(@Req() req) {
        return req.user;
    }

    @ApiOperation({ summary: 'Google登录'})
    @UseGuards(GoogleOAuthGuard)
    @Get('google/callback')
    async googleOauthLogin(@Req() req) {
        return req.user;
    }

    @ApiOperation({ summary: '微信登录'})
    @UseGuards(WechatOAuthGuard)
    @Post('wechat/callback')
    async wechatOauthLogin(@Req() req) {
        return req.user;
    }

    @ApiOperation({ summary: '登出'})
    @Post('logout')
    async loginout(@Req() req, @Res({passthrough: true}) res: Response) {
        const logoutAsyncFn = promisify(req.logout).bind(req);
        await logoutAsyncFn();
        res.clearCookie('sessionId');
        return 'Logout successful';
    }
}
