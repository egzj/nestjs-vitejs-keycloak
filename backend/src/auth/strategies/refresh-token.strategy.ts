import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EnvironmentVariables } from '../../constant';

export type CustomerJwtPayload = {};

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  private logger = new Logger(RefreshTokenStrategy.name, { timestamp: true });

  constructor(private configService: ConfigService<EnvironmentVariables>) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: any) => {
          console.log(
            'req?.cookies?.["refreshToken"]:',
            req?.cookies?.['refreshToken'],
          );
          return req?.cookies?.['refreshToken'];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('REFRESH_TOKEN_SECRET'),
    });
  }

  async validate(payload: CustomerJwtPayload & jwt.JwtPayload) {
    this.logger.debug(
      `RefreshTokenStrategy.validate() payload ${JSON.stringify(payload)}`,
    );
    return payload;
  }
}
