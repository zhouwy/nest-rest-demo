import { UserDto } from './user.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Pagination } from 'src/common/interfaces/pagination.interface';

class PaginationDto implements Pagination {
    @ApiProperty()
    total: number;

    @ApiProperty()
    pageNo: number;

    @ApiProperty()
    pageSize: number;
}

export class PaginatedOutputDto {
    @ApiProperty({type: () =>[UserDto]})
    @Type(() => UserDto)
    items: UserDto[];

    @ApiProperty()
    summary: Partial<UserDto>;

    @ApiProperty()
    pagination: PaginationDto;

    constructor(items, pagination) {
        this.items = items;
        this.pagination = pagination;
    }
}
