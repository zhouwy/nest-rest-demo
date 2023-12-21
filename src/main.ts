import { NestFactory, HttpAdapterHost, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor} from '@nestjs/common';
import { BizExceptionFilter } from 'src/common/filters/biz-exception.filter';
import { AllExceptionsFilter } from 'src/common/filters/all-exception.filter';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

    const adapterHost = app.get(HttpAdapterHost);

    // global pipes
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    // global response interceptor
    app.useGlobalInterceptors(new ResponseInterceptor());

     // global serilization interceptor
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

    // global exception fitler
    app.useGlobalFilters(
        new AllExceptionsFilter(adapterHost),
        new BizExceptionFilter(adapterHost)
    );

    await app.listen(3000, '0.0.0.0');
}

bootstrap();
