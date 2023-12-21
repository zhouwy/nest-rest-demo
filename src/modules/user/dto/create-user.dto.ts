import { IsNotEmpty, IsString, MaxLength, MinLength, IsEmail, Matches } from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'})
    password: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(300)
    name: string;
}
