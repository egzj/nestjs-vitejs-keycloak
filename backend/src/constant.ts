export const API_PREFIX = '/api/v1';
export interface EnvironmentVariables {
  NODE_ENV: 'development' | 'production';
  PORT: number;

  KEYCLOAK_URL: string;
  KEYCLOAK_REALM: string;
  KEYCLOAK_CLIENT_ID: string;
  KEYCLOAK_CLIENT_SECRET: string;

  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
}

export const REFRESH_TOKEN_COOKIE_KEY = 'refreshToken';

export interface KeycloakRefreshSuccessResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  id_token: string;
  'not-before-policy': number;
  session_state: string;
  scope: string;
}
