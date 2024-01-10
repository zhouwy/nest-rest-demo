import { Strategy } from 'passport-local';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
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
        return await authService.validateUser(username, password);
    }
}
