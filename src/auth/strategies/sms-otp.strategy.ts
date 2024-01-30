import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { Injectable, BadRequestException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class SmsOtpStrategy extends PassportStrategy(Strategy, 'smsOtp') {
    constructor(private moduleRef: ModuleRef) {
        super({
            passReqToCallback: true,
            usernameField: 'phone'
        });
    }

    async validate(request, phone: string, password: string): Promise<any> {
        const contextId = ContextIdFactory.getByRequest(request);
        const authService = await this.moduleRef.resolve(AuthService, contextId);
        const user = await authService.validateUserBySmsOtp(phone, password);
        if (!user) {
            throw new BadRequestException('Invalid credentials');
        }
        return user;
    }
}
