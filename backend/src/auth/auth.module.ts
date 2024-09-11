import { Module } from '@nestjs/common';
import { RefreshTokenStrategy } from 'src/auth/strategies/refresh-token.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { KeycloakModule } from 'src/keycloak/keycloak.module';

@Module({
  imports: [KeycloakModule],
  controllers: [AuthController],
  providers: [AuthService, RefreshTokenStrategy],
  exports: [],
})
export class AuthModule {}
