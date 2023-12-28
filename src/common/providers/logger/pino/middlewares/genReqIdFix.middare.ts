import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class GenReqIdFixMiddleware implements NestMiddleware {
    use(req: any, res: any, next: () => void) {
        // 因为切换成FastifyAdapter后，fastify会自动生成req.id，导致nestjs-pino提供的pino-http插件中的genReqId不会被调用
        // 所以写个全局插件将req.id置为空，这样pino-http中的genReqId才会被调用
        // https://github.com/pinojs/pino-http/issues/275
        req.id = '';
        next();
    }
}
