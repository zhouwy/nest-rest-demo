import { Abilities } from '@casl/ability';
import { SetMetadata } from '@nestjs/common';

interface IPolicyHandler {
    handle(ability: Abilities): boolean;
}

type PolicyHandlerCallback = (ability: Abilities) => boolean;

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;

export const CHECK_POLICIES_KEY = 'check_policy';
export const CheckPolicies = (...handlers: PolicyHandler[]) => SetMetadata(CHECK_POLICIES_KEY, handlers);
