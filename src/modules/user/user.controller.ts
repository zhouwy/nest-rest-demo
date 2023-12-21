import { Controller, Get, Post, Body, Patch, Param, Query, Delete, ParseIntPipe, DefaultValuePipe} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, PaginatedOutputDto, UserDto } from './dto';
import { BizException } from 'src/common/exceptions/biz.exception';
import { BizCode } from 'src/common/enums/biz-code.enum';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        return new UserDto(await this.userService.create(createUserDto));
    }

    @Get()
    async findMany(
        @Query('pageNo', new DefaultValuePipe(1), ParseIntPipe) pageNo: number,
        @Query('pageSize', new DefaultValuePipe(1), ParseIntPipe) pageSize: number
    ) {
        const [total, users] = await this.userService.findMany(
            (pageNo - 1) * pageSize,
            pageSize
        );

        return new PaginatedOutputDto(users, {
            total,
            pageNo,
            pageSize
        });
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const user = await this.userService.findOne(id);
        if (!user) {
            throw new BizException(BizCode.FAILURE);
        }
        return new UserDto(user);
    }

    @Patch(':id')
   async update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
        return new UserDto(await this.userService.update(+id, updateUserDto));
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.userService.remove(id);
    }
}

