import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { KeycloakService } from 'src/keycloak/keycloak.service';
import { Cookies } from 'src/utils';
import { API_PREFIX, REFRESH_TOKEN_COOKIE_KEY } from '../constant';

@Controller(`${API_PREFIX}/auth`)
export class AuthController {
  constructor(private keycloakService: KeycloakService) {}

  /*
    Sample response
    {
      redirect_uri: 'http://localhost:3000/products',
      session_state: '4c72304a-f445-47a8-b96c-58670e514e46',
      iss: 'http://localhost:8081/realms/sgp',
      code: 'e6b97542-eba6-4e10-a669-c439fca944a6.4c72304a-f445-47a8-b96c-58670e514e46.48b6b587-6365-4faf-ac1f-27e2c12413ae'
    }
  */
  @Get('callback')
  async callback(
    @Query()
    query: {
      code: string;
      redirect_uri: string;
      session_state: string;
      iss: string;
    },
    @Res() res: Response,
  ) {
    try {
      const data = await this.keycloakService.requestTokensUsingCode(
        query.code,
        query.redirect_uri,
      );
      // Create Refresh Token Cookie
      res.cookie(REFRESH_TOKEN_COOKIE_KEY, data.refresh_token, {
        expires: new Date(Date.now() + data.refresh_expires_in * 1000),
        sameSite: 'strict',
        httpOnly: true,
        secure: false,
      });

      // redirect to frontend with accessToken
      return res.redirect(
        `${process.env.BASE_URL}/auth?access_token=${data.access_token}&id_token=${data.id_token}&redirect_uri=${query.redirect_uri}`,
      );
    } catch (err) {
      console.log(err);
      return res.redirect(`${process.env.BASE_URL}/auth?error=invalid_code`);
    }
  }

  @Get('me')
  @UseGuards(AccessTokenGuard)
  async me(@Req() req: Request & { user: any }, @Res() res: Response) {
    return res.json({ data: req.user });
  }

  @Get('refresh')
  async refresh(
    @Cookies(REFRESH_TOKEN_COOKIE_KEY) refreshToken: string,
    @Res() res: Response,
  ) {
    try {
      const data = await this.keycloakService.refresh(refreshToken);
      // Create Refresh Token Cookie
      res.cookie(REFRESH_TOKEN_COOKIE_KEY, data.refresh_token, {
        expires: new Date(Date.now() + data.refresh_expires_in * 1000),
        sameSite: 'strict',
        httpOnly: true,
        secure: false,
      });
      return res.status(200).json({ accessToken: data.access_token });
    } catch (err) {
      console.log(err);
      return res.status(401).json({ message: 'Invalid Refresh Token' });
    }
  }

  @Get('logout')
  async logout(
    @Req() req: Request & { user: any },
    @Cookies(REFRESH_TOKEN_COOKIE_KEY) refreshToken: string,
    @Res() res: Response,
  ) {
    try {
      const data = await this.keycloakService.logout(refreshToken);
      res.clearCookie(REFRESH_TOKEN_COOKIE_KEY);

      return res.status(200).json({ message: 'Logout Successfully' });
    } catch (err) {
      return res.status(401).json({ message: 'Invalid Refresh Token' });
    }
  }
}
