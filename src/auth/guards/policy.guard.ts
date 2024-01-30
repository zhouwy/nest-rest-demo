import { Reflector } from '@nestjs/core';
import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';
import { PolicyHandler, CHECK_POLICIES_KEY } from '../decorators/check-policies.decorator';

import { CaslFactory } from '../casl.factory';

@Injectable()
export class PoliciesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private caslAbilityFactory: CaslFactory
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const policyHandlers = this.reflector.get<PolicyHandler[]>(CHECK_POLICIES_KEY, context.getHandler()) || [];

        const req = context.switchToHttp().getRequest();
        const ability = this.caslAbilityFactory.createForUser(req);

        return policyHandlers.every(handler => this.execPolicyHandler(handler, ability));
    }

    private execPolicyHandler(handler: PolicyHandler, ability: any) {
        if (typeof handler === 'function') {
            return handler(ability);
        }
        return handler.handle(ability);
    }
}
