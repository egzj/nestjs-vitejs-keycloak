import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { AccessTokenStrategy } from 'src/auth/strategies/access-token.strategy';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, AccessTokenStrategy],
})
export class ProductsModule {}
