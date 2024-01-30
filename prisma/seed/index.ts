import * as _ from 'lodash';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { users } from './authn';
import { roles, permissions } from './authz';

const prisma = new PrismaClient();

const DEFAULT_PASSWORD = 'Asd123';
const DEFAULT_SALT_ROUNDS = 10;

async function main() {

    for await (const role of roles) {
        const roleAttrs = _.cloneDeep(role);
        delete roleAttrs.id;
        await prisma.role.upsert({
            where: {
                id: role.id
            },
            update: {},
            create: roleAttrs
        });
    }

    for await (const permission of permissions) {
        const permissionAttrs = _.cloneDeep(permission);
        delete permissionAttrs.id;
        delete permissionAttrs.roleId;
        await prisma.permission.upsert({
            where: {
                id: permission.id
            },
            update: {},
            create: {
                ...permissionAttrs,
                role: {
                    connect: {
                        id: permission.roleId
                    }
                }
            }
        });
    }

    for await (const user of users) {
        const {email, phone, ...userAttrs} = _.cloneDeep(user);
        delete userAttrs.id;
        await prisma.user.upsert({
            where: {
                id: user.id
            },
            update: {},
            create: {
                ...userAttrs,
                ...(email ? {
                    userEmail: {
                        create: {
                            email,
                            password: bcrypt.hashSync(DEFAULT_PASSWORD, DEFAULT_SALT_ROUNDS)
                        }
                    }
                } : {}),
                ...(
                    phone ? {
                        userSms: {
                            create: {
                                phone
                            }
                        }
                    } : {}
                ),
                role: {
                    connect: {
                        id: 2 - user.id % 2
                    }
                }
            },

        });
    }
}

// execute the main function
main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        // close Prisma Client at the end
        await prisma.$disconnect();
    });
