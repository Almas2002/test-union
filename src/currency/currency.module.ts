import { Module } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CurrencyController } from './currency.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Currency } from './currency.entity';

@Module({
  providers: [CurrencyService],
  controllers: [CurrencyController],
  imports:[TypeOrmModule.forFeature([Currency])]
})
export class CurrencyModule {
}
