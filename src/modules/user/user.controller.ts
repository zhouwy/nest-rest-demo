import { Controller, Get, Post, Body, Patch, Param, Query, Delete, ParseIntPipe, DefaultValuePipe} from '@nestjs/common';
import { BizException } from 'src/common/exceptions/biz.exception';
import { BizCode } from 'src/common/enums/biz-code.enum';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, PaginatedOutputDto, UserDto } from './dto';

@ApiTags('user')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiOperation({ summary: '新建用户'})
    @ApiResponse({ type: UserDto})
    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        return new UserDto(await this.userService.create(createUserDto));
    }

    @ApiOperation({ summary: '批量获取用户信息'})
    @ApiResponse({ type: PaginatedOutputDto})
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

    @ApiOperation({ summary: '获取单个用户信息'})
    @ApiResponse({ type: UserDto})
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const user = await this.userService.findOne(id);
        if (!user) {
            throw new BizException(BizCode.FAILURE);
        }
        return new UserDto(user);
    }

    @ApiOperation({ summary: '修改用户信息'})
    @ApiResponse({ type: UserDto})
    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
        return new UserDto(await this.userService.update(+id, updateUserDto));
    }

    @ApiOperation({ summary: '删除单个用户信息'})
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.userService.remove(id);
    }
}

