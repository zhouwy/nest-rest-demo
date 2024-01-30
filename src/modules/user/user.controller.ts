import { BizCode } from 'src/common/enums/biz-code.enum';
import { BizException } from 'src/common/exceptions/biz.exception';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MailService } from 'src/common/providers/mail/smtp/mail.service';
import { CacheService } from 'src/common/providers/cache/redis/cache.service';
import { Controller, Get, Post, Body, Patch, Param, Query, Delete, ParseIntPipe, DefaultValuePipe, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, PaginatedOutputDto, UserDto } from './dto';

@ApiTags('user')
@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly cacheManager: CacheService,
        private readonly mailService: MailService
    ) {}

    @ApiOperation({ summary: '获取用户信息'})
    @Get('info')
    async getUserInfo(@Req() req) {
        const userId = req.user.id;
        const user = await this.userService.findOne(userId);
        if (!user) {
            throw new BizException(BizCode.FAILURE);
        }
        return new UserDto(user);
    }

    @ApiOperation({ summary: '测试缓存'})
    @Post('cache')
    async cache() {
        const value = await this.cacheManager.get('cache_test');
        if (value) {
            return value;
        }
        const newValue = Math.floor(Math.random() * 100);
        await this.cacheManager.set('cache_test', newValue);
        return newValue;
    }

    @ApiOperation({ summary: '测试发送消息队列&发送邮件'})
    @Get('mail')
    async sendMail() {
        const result = await this.mailService.sendRegisterConfirmMail({
            to: 'wybitcoin@outlook.com',
            subject: 'test'
        });
        return result;
    }

    @ApiOperation({ summary: '新建用户'})
    @ApiResponse({ type: UserDto})
    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        return new UserDto(await this.userService.createWithEmailAndPassword(createUserDto));
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

