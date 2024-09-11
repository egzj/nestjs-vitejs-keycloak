import { Injectable, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import {
  EnvironmentVariables,
  KeycloakRefreshSuccessResponse,
} from 'src/constant';

@Injectable()
export class KeycloakService {
  kcUrl: string;
  realm: string;
  clientId: string;
  clientSecret: string;

  constructor(private configService: ConfigService<EnvironmentVariables>) {
    this.kcUrl = this.configService.get('KEYCLOAK_URL');
    this.realm = this.configService.get('KEYCLOAK_REALM');
    this.clientId = this.configService.get('KEYCLOAK_CLIENT_ID');
    this.clientSecret = this.configService.get('KEYCLOAK_CLIENT_SECRET');
  }

  async requestTokensUsingCode(code: string, redirectUri: string) {
    const { data } = await axios.post<KeycloakRefreshSuccessResponse>(
      `${this.kcUrl}/realms/${this.realm}/protocol/openid-connect/token`,
      {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: `http://localhost:5000/api/v1/auth/callback?redirect_uri=${redirectUri}`,
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
    console.log('data:', data);

    return data;
  }

  async refresh(refreshToken: string) {
    const { data } = await axios.post<KeycloakRefreshSuccessResponse>(
      `${this.kcUrl}/realms/${this.realm}/protocol/openid-connect/token`,
      {
        client_id: process.env.KEYCLOAK_CLIENT_ID!,
        client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    return data;
  }

  /* https://stackoverflow.com/questions/46689034/logout-user-via-keycloak-rest-api-doesnt-work/46769801#46769801 */
  async logout(refreshToken: string) {
    const { data } = await axios.post<KeycloakRefreshSuccessResponse>(
      `${this.kcUrl}/realms/${this.realm}/protocol/openid-connect/logout`,
      {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: refreshToken,
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          // Seems like access token is not required.
          // Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return data;
  }
}
