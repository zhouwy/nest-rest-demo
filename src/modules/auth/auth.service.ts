import * as bcrypt from 'bcrypt';
import { PrismaService } from 'nestjs-prisma';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}

    async validateUser(email: string, password: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });

        if (!user) {
            throw new NotFoundException('Could not find the user');
        }

        const passwordMatched = await bcrypt.compare(password, user.password);

        if (!passwordMatched) {
            throw new BadRequestException('Invalid credentials');
        }

        const { password: pass, ...result } = user;

        return result;
    }
}
