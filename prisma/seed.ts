import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const alice = await prisma.user.upsert({
        where: { email: 'alice@prisma.io' },
        update: {},
        create: {
            email: 'alice@prisma.io',
            name: 'Alice',
            posts: {
                create: [
                    {
                        title: 'My first day at Prisma',
                        categories: {
                            create: {
                                name: 'Office'
                            }
                        }
                    },
                    {
                        title: 'How to connect to a SQLite database',
                        categories: {
                            create: [{ name: 'Databases' }, { name: 'Tutorials' }]
                        }
                    }
                ]
            }
        }
    });
    const bob = await prisma.user.upsert({
        where: { email: 'bob@prisma.io' },
        update: {},
        create: {
            email: 'bob@prisma.io',
            name: 'Bob',
            posts: {
                create: [
                    {
                        title: 'Follow Prisma on Twitter',
                        categories: {
                            create: {
                                name: 'Twitter'
                            }
                        }
                    },
                    {
                        title: 'Follow Nexus on Twitter',
                        categories: {
                            create: {
                                name: 'Twitter'
                            }
                        }
                    }
                ]
            }
        }
    });
    console.log({ alice, bob });
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
