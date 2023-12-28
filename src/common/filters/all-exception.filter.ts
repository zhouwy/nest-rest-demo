
import { HttpAdapterHost } from '@nestjs/core';
import { BizCode } from 'src/common/enums/biz-code.enum';
import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    catch(exception: any, host: ArgumentsHost): void {
        const { httpAdapter } = this.httpAdapterHost;

        const ctx = host.switchToHttp();
        const req = ctx.getRequest();

        // 跳过健康检查
        const status = req.url === '/api/health' ? HttpStatus.INTERNAL_SERVER_ERROR : HttpStatus.OK

        const responseBody = {
            code: BizCode.FAILURE,
            data: null,
            message: exception?.getResponse?.()?.message || HttpStatus[HttpStatus.INTERNAL_SERVER_ERROR]
        };

        httpAdapter.reply(ctx.getResponse(), responseBody, status);
    }
}
