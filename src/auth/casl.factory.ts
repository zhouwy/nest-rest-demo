import * as _ from 'lodash';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { createMongoAbility } from '@casl/ability';

@Injectable()
export class CaslFactory {
    constructor(private prisma: PrismaService) {}

    async createForUser(req) {
        if (req.ability) {
            return req.ability;
        }

        let rules = req.session.abilityRules;

        if (!rules) {
            rules = await this.prisma.permission.findMany({
                where: {
                    role: {
                        some: {
                            id: {
                                in: req.user.role.map(i => i.id)
                            }
                        }
                    }
                }
            });
            const parsedRules = this.parseRules(rules, req.user);
            req.session.abilityRules = parsedRules;
        }
        req.ability = createMongoAbility(rules);

        return req.ability;
    }

    parseRules(rules: any, currentUser: any) {
        return rules.map(permission => {
            if (_.size(permission.conditions)) {
                const parsedCondition = _.mapValues(permission.conditions, condition => {
                    const compiled = _.template(condition);
                    return compiled(currentUser);
                });
                return {
                    ...permission,
                    conditions: parsedCondition
                };
            }
            return permission;
        });
    }
}
