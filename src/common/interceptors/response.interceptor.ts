
import { Observable, map } from 'rxjs';
import { BizCode } from 'src/common/enums/biz-code.enum';
import { Response } from 'src/common/interfaces/response.interface';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response> {
        return next.handle().pipe(
            map(data => this.responseHandler(data))
        );
    }

    responseHandler(data) {
        return {
            code: BizCode.SUCCESS,
            data,
            message: null
        };
    }
}
