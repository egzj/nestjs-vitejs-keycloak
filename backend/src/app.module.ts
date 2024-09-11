import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { KeycloakModule } from './keycloak/keycloak.module';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import * as Joi from 'joi';

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
    AuthModule,
    KeycloakModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
