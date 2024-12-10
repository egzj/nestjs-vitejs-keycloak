import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as bcrypt from 'bcrypt';
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

  /**
   * NOTE: @keycloak/keycloak-admin-client in nestjs
   * https://github.com/nestjs/nest/issues/7021
   * https://github.com/keycloak/keycloak-nodejs-admin-client/issues/523
   */
  private dynamicKeycloakImport = async () =>
    new Function("return import('@keycloak/keycloak-admin-client')")();

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

  async getCustomers() {
    const KCadmCli = (await this.dynamicKeycloakImport()).default;
    const kcAdminClient = new KCadmCli({
      baseUrl: this.kcUrl,
      realmName: this.realm,
    });
    await kcAdminClient.auth({
      grantType: 'client_credentials',
      clientId: this.clientId,
      clientSecret: this.clientSecret,
      scopes: ['openid'],
    });
    const users = await kcAdminClient.users.find();
    return users;
  }

  async insertUser(user: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNo?: string;
  }) {
    const KCadmCli = (await this.dynamicKeycloakImport()).default;
    const kcAdminClient = new KCadmCli({
      baseUrl: this.kcUrl,
      realmName: this.realm,
    });
    await kcAdminClient.auth({
      grantType: 'client_credentials',
      clientId: this.clientId,
      clientSecret: this.clientSecret,
    });

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(user.password, salt);

    const newUser = {
      credentials: [
        {
          algorithm: 'bcrypt',
          hashedSaltedValue: hashedPassword,
          hashIterations: 10,
          type: 'password',
        },
      ],
      email: user.email,
      username: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      attributes: {
        ...(user.phoneNo && { phoneNo: user.phoneNo }),
      },
      emailVerified: true,
      enabled: true,
    };
    return await kcAdminClient.users.create(newUser);
  }
}
