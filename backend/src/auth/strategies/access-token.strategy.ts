import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EnvironmentVariables } from 'src/constant';

export type CustomerJwtPayload = {};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-access-token',
) {
  private logger = new Logger(AccessTokenStrategy.name, { timestamp: true });

  constructor(private configService: ConfigService<EnvironmentVariables>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: CustomerJwtPayload & jwt.JwtPayload) {
    this.logger.debug(
      `AccessTokenStrategy.validate() payload ${JSON.stringify(payload)}`,
    );
    return payload;
  }
}
