import * as path from 'node:path';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { GenReqIdFixMiddleware } from './middlewares/genReqIdFix.middare';

@Module({
    imports: [
        LoggerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => {
                const { randomUUID } = await import('node:crypto');
                return {
                    pinoHttp: {
                        genReqId: function (req, res) {
                            const existingID = req.headers['x-request-id'];
                            if (existingID) return existingID;
                            const id = randomUUID();
                            res.setHeader('X-Request-Id', id);
                            return id;
                        },
                        customProps: () => ({ context: 'HTTP' }),
                        transport: {
                            targets: config.get('app.isProduction')
                                ? [
                                      {
                                          target: path.resolve(__dirname, 'transports/rotate-file/index'),
                                          options: {
                                              dirname: `logs`, // 日志保存的目录
                                              filename: '%DATE%.log', // 日志名称，占位符 %DATE% 取值为 datePattern 值。
                                              datePattern: 'YYYY-MM-DD', // 日志轮换的频率，此处表示每天。
                                              zippedArchive: true, // 是否通过压缩的方式归档被轮换的日志文件。
                                              frequency: '1d',
                                              maxFiles: '14d' // 保留日志文件的最大天数，此处表示自动删除超过 14 天的日志文件。
                                          }
                                      }
                                  ]
                                : [
                                      {
                                          target: 'pino-pretty',
                                          options: {
                                              // colorize: true,
                                              singleLine: true
                                              // translateTime: "yyyy-mm-dd'T'HH:MM:ss.l'Z'",
                                              // ignore: 'pid,hostname',
                                              // minimumLevel: 'info',
                                              // errorLikeObjectKeys: ['err', 'error']
                                          }
                                      }
                                  ]
                        }
                    }
                };
            }
        })
    ]
})
export class PinoProviderModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(GenReqIdFixMiddleware).forRoutes('*');
    }
}
