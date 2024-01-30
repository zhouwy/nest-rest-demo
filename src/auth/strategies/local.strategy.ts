import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { Injectable, BadRequestException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private moduleRef: ModuleRef) {
        super({
            passReqToCallback: true,
            usernameField: 'email'
        });
    }

    async validate(request, username: string, password: string): Promise<any> {
        const contextId = ContextIdFactory.getByRequest(request);
        const authService = await this.moduleRef.resolve(AuthService, contextId);
        const user = await authService.validateUser(username, password);
        if (!user) {
            throw new BadRequestException('Invalid credentials');
        }
        return user;
    }
}
