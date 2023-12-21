
import { HttpAdapterHost } from '@nestjs/core';
import { BizException } from 'src/common/exceptions/biz.exception';
import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';

@Catch(BizException)
export class BizExceptionFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    catch(exception: BizException, host: ArgumentsHost) {
        const { httpAdapter } = this.httpAdapterHost;

        const ctx = host.switchToHttp();

        const responseBody = {
            code: exception.code,
            data: null,
            message: exception.message
        };

        httpAdapter.reply(ctx.getResponse(), responseBody, HttpStatus.OK);
    }
}

