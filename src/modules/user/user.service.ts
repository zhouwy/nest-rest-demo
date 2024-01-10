import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async create(createUserDto: CreateUserDto) {
        const password = await bcrypt.hash(createUserDto.password, 10);
        return this.prisma.user.create({
            data: {
                ...createUserDto,
                password
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
        return this.prisma.user.findUnique({
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
