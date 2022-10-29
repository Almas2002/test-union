import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { AuthGuard } from '../auth/guard/auth.guard';
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Currency } from './currency.entity';
@ApiTags('currency')
@Controller()
export class CurrencyController {
  constructor(private currencyService: CurrencyService) {
  }


  @ApiResponse({
    status: 404, schema: {
      oneOf: [
        {
          properties: {
            status: {
              type: 'number',
              example: 404,
            },
            message: {
              type: 'string',
              example: 'currency is not defined',
            },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 401, schema: {
      oneOf: [
        {
          properties: {
            status: {
              type: 'number',
              example: 401,
            },
            message: {
              type: 'string',
              example: 'Вы не зарегестрированы',
            },
          },
        },
      ],
    },
  })
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOkResponse({type:Currency})
  @UseGuards(AuthGuard)
  @Get('currency/:id')
  get(@Param('id')id: number) {
    return this.currencyService.getOne(id);
  }
  @ApiResponse({
    status: 401, schema: {
      oneOf: [
        {
          properties: {
            status: {
              type: 'number',
              example: 401,
            },
            message: {
              type: 'string',
              example: 'Вы не зарегестрированы',
            },
          },
        },
      ],
    },
  })
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOkResponse({type:[Currency]})
  @UseGuards(AuthGuard)
  @Get('currencies')
  getList() {
    return this.currencyService.getList();
  }
}
