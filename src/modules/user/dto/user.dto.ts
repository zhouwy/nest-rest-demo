import { User, Role } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserDto implements User {

    id: number;

    email: string;

    name: string;

    @Exclude()
    password: string;

    role: Role;

    constructor(partial: Partial<UserDto>) {
        Object.assign(this, partial);
    }
}
