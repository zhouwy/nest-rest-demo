import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async createWithEmailAndPassword(createUserDto: CreateUserDto) {
        const { email, password, name } = createUserDto;
        const hashedPassword = await bcrypt.hash(password, 10);
        return this.prisma.userEmail.create({
            data: {
                email,
                password: hashedPassword,
                confirmToken: '23',
                user: {
                    create: {
                        name
                    }
                }
            }
        });
    }


    findMany(skip: number, take: number) {
        return this.prisma.$transaction([
            this.prisma.user.count(),
            this.prisma.user.findMany({
                skip,
                take
            })
        ]);
    }

    findOne(id: number) {
        return this.prisma.user.findUnique({
            where: {
                id
            }
        });
    }

    findOneByEmail(email: string) {
        return this.prisma.userEmail.findUnique({
            include: { user: true },
            where: {
                email
            }
        });
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        return this.prisma.user.update({
            data: updateUserDto,
            where: {
                id
            }
        });
    }

    remove(id: number) {
        return this.prisma.user.delete({
            where: {
                id
            }
        });
    }
}
