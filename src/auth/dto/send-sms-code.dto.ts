import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber } from 'class-validator';

export class SendSmsCodeDto {
    @ApiProperty()
    @IsPhoneNumber('CN')
    phone: string;
}
