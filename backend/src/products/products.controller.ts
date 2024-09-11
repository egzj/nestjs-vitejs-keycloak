import { Controller, Get, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { API_PREFIX } from 'src/constant';

@UseGuards(AccessTokenGuard)
@Controller(`${API_PREFIX}/products`)
export class ProductsController {
  constructor() {}

  @Get()
  async getProducts() {
    return {
      success: true,
      data: [
        { id: 1, name: 'Product 1', price: 100 },
        { id: 2, name: 'Product 2', price: 150 },
        { id: 3, name: 'Product 3', price: 200 },
        { id: 4, name: 'Product 4', price: 250 },
        { id: 5, name: 'Product 5', price: 300 },
        { id: 6, name: 'Product 6', price: 350 },
        { id: 7, name: 'Product 7', price: 400 },
        { id: 8, name: 'Product 8', price: 450 },
        { id: 9, name: 'Product 9', price: 500 },
        { id: 10, name: 'Product 10', price: 550 },
      ],
    };
  }
}
