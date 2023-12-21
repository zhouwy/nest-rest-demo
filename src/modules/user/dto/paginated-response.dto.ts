import { UserDto } from './user.dto';
import { Type } from 'class-transformer';

export class PaginatedOutputDto {
    @Type(() => UserDto)
    items: UserDto[];
    summary: Partial<UserDto>;
    pagination: {
        total: number;
        pageNo: number;
        pageSize: number;
    };

    constructor(items, pagination) {
        this.items = items;
        this.pagination = pagination;
    }
}
