import { ConfigService } from '@nestjs/config';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestFactory, HttpAdapterHost, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { BizExceptionFilter } from 'src/common/filters/biz-exception.filter';
import { AllExceptionsFilter } from 'src/common/filters/all-exception.filter';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { AppModule } from './app.module';
import { applyMiddlewares } from './app.middleware';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { bufferLogs: true });

    const cf = app.get(ConfigService);

    app.setGlobalPrefix(cf.get('app.globalPrefix'));
    app.useLogger(app.get(Logger));

    applyMiddlewares(app);

    const adapterHost = app.get(HttpAdapterHost);

    // global pipes
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    // global response / serilization / loggerError interceptor
    app.useGlobalInterceptors(
        new ResponseInterceptor(),
        new ClassSerializerInterceptor(app.get(Reflector)),
        new LoggerErrorInterceptor()
    );

    // global exception fitler
    // app.useGlobalFilters(new AllExceptionsFilter(adapterHost), new BizExceptionFilter(adapterHost));

    // swagger
    const config = new DocumentBuilder()
        .setTitle('Swagger example')
        .setDescription('The Swagger API description')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);

    await app.listen(3000);
}

bootstrap();
