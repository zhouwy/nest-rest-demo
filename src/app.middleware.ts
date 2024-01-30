import helmet from 'helmet';
import { Redis } from 'ioredis';
import * as passport from 'passport';
import RedisStore from 'connect-redis';
import * as session from 'express-session';
import * as compression from 'compression';
import { ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';

export async function applyMiddlewares(app: INestApplication) {
    const configService = app.get(ConfigService);

    const isProduction = configService.get('app.isProduction');

    app.use(helmet());
    app.use(compression());

    app.use(
        session({
            name: 'sessionId',
            secret: 'my-secret',
            saveUninitialized: false,
            resave: false,
            cookie: {
                secure: false,
                sameSite: false
            },
            ...(isProduction
                ? {
                      store: new RedisStore({
                          client: new Redis({
                              host: configService.get('REDIS_HOST'),
                              port: parseInt(configService.get('REDIS_PORT')),
                              db: 2
                          })
                      })
                  }
                : {})
        })
    );

    app.use(passport.initialize());
    app.use(passport.session());
}
