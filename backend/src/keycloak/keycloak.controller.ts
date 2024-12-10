import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { KeycloakService } from 'src/keycloak/keycloak.service';
import { API_PREFIX } from '../constant';

@Controller(`${API_PREFIX}/keycloak`)
export class KeycloakController {
  constructor(private keycloakService: KeycloakService) {}

  @Post('users')
  async createUser(
    @Body()
    body: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      phoneNo?: string;
    },
    @Res() res: Response,
  ) {
    try {
      const data = await this.keycloakService.insertUser(body);
      return res.status(201).json(data);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: err.message });
    }
  }
}
