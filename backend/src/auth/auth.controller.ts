import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { KeycloakService } from 'src/keycloak/keycloak.service';
import { Cookies } from 'src/utils';
import { API_PREFIX, REFRESH_TOKEN_COOKIE_KEY } from '../constant';

@Controller(`${API_PREFIX}/auth`)
export class AuthController {
  constructor(private keycloakService: KeycloakService) {}

  @Get('callback')
  async callback(
    @Query() query: { code: string; redirect_uri: string },
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
        `http://localhost:3000/auth?access_token=${data.access_token}&id_token=${data.id_token}&redirect_uri=${query.redirect_uri}`,
      );
    } catch (err) {
      console.log(err);
      return res.redirect('http://localhost:3000/auth?error=invalid_code');
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
