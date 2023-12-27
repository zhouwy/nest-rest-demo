import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestFactory, HttpAdapterHost, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { BizExceptionFilter } from 'src/common/filters/biz-exception.filter';
import { AllExceptionsFilter } from 'src/common/filters/all-exception.filter';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), { bufferLogs: true });
    const adapterHost = app.get(HttpAdapterHost);

    app.useLogger(app.get(Logger));

    // global pipes
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    // global response interceptor
    app.useGlobalInterceptors(new ResponseInterceptor());

    // global serilization interceptor
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)), new LoggerErrorInterceptor());

    // global exception fitler
    app.useGlobalFilters(new AllExceptionsFilter(adapterHost), new BizExceptionFilter(adapterHost));

    const config = new DocumentBuilder()
        .setTitle('Swagger example')
        .setDescription('The Swagger API description')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);

    await app.listen(3000, '0.0.0.0');
}

bootstrap();
