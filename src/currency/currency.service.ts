import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Currency } from './currency.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CurrencyService {
  constructor(@InjectRepository(Currency) private currencyRepository:Repository<Currency>) {}

  async getOne(id:number){
    return this.currencyRepository.findOne({where:{id}})
  }

  async getList(){
    return this.currencyRepository.find()
  }
}
