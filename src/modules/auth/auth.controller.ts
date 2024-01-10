import { promisify } from 'util';
import { Response } from 'express';
import { Public } from 'src/common/decorators/public.decorator';
import { Body, Controller, Post, Req, Res, UseGuards, Get} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthenticatedGuard } from './guards/authenticated.gurad';

@Controller('auth')
export class AuthController {
    constructor(private readonly userService: UserService) {}

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Req() req) {
        return req.user;
    }

    @Post('logout')
    async loginout(@Req() req, @Res({passthrough: true}) res: Response) {
        const logoutAsyncFn = promisify(req.logout).bind(req);
        await logoutAsyncFn();
        res.clearCookie('sessionId');
        return 'Logout successful';
    }

    @Public()
    @Post('register')
    async register(@Body() registerDto) {
        return this.userService.create(registerDto);
    }

    @Get('profile')
    getProfile(@Req() req) {
        return req.user
    }
}
