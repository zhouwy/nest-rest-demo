import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    create(createUserDto: CreateUserDto): any {
        return this.prisma.user.create({
            data: createUserDto
        });
    }

    findMany(skip: number, take: number): any {
        return this.prisma.$transaction([
            this.prisma.user.count(),
            this.prisma.user.findMany({
                skip,
                take
            })
        ]);
    }

    findOne(id: number): any {
        return this.prisma.user.findUnique({
            where: {
                id
            }
        });
    }

    update(id: number, updateUserDto: UpdateUserDto): any {
        return this.prisma.user.update({
            data: updateUserDto,
            where: {
                id
            }
        });
    }

    remove(id: number): any {
        return this.prisma.user.delete({
            where: {
                id
            }
        });
    }
}
