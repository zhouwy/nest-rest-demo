import { User, Role } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto implements User {

    @ApiProperty()
    id: number;

    @ApiProperty()
    email: string;

    @ApiProperty()
    name: string;

    @Exclude()
    password: string;

    @ApiProperty()
    role: Role;

    constructor(partial: Partial<UserDto>) {
        Object.assign(this, partial);
    }
}
