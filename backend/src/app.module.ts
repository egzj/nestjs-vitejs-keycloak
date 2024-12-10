import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as Joi from 'joi';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { KeycloakModule } from './keycloak/keycloak.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production')
          .default('development'),
        PORT: Joi.number().port().default(5000),

        KEYCLOAK_URL: Joi.string(),
        KEYCLOAK_REALM: Joi.string(),
        KEYCLOAK_CLIENT_ID: Joi.string(),
        KEYCLOAK_CLIENT_SECRET: Joi.string(),

        ACCESS_TOKEN_SECRET: Joi.string(),
        REFRESH_TOKEN_SECRET: Joi.string(),
      }),
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../', 'build'),
    }),
    AuthModule,
    KeycloakModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
