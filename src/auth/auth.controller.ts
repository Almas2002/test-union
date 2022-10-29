import { Body, Controller, Get, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserLoginDto } from './dto/user-login.dto';

@ApiTags('авторизация')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @ApiResponse({
    status: 422, schema: {
      oneOf: [
        {
          properties: {
            errors: {
              properties: {
                password: {
                  type: 'array',
                  example: ['password should not be empty',],
                },
                phone: {
                  type: 'array',
                  example: ['phone should not be empty',],
                },
              },
            },
          },
        },
      ],
    },
  })
  @ApiCreatedResponse({description:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNjY3MDg2MjUyLCJleHAiOjE2NjcwOTcwNTJ9.UGTO6OglEXQM0s5EdiS00bb4ZBmjlqcVYVbHFGR4gb8"})
  @ApiOperation({summary: 'login пользователя'})
  @ApiResponse({status: 201})
  @Post('login')
  async login(@Body()data: UserLoginDto, @Res({passthrough: true})res) {
    const response = await this.authService.login(data);
    res.cookie('refreshToken', response.refresh_token, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
    return response.access_token
  }
  @ApiResponse({
    status: 422, schema: {
      oneOf: [
        {
          properties: {
            errors: {
              properties: {
                password: {
                  type: 'array',
                  example: ['password should not be empty',],
                },
                phone: {
                  type: 'array',
                  example: ['phone should not be empty',],
                },
              },
            },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 408, schema: {
      oneOf: [
        {
          properties: {
            status: {
              type: 'number',
              example: 408,
            },
            message: {
              type: 'string',
              example: 'такой телефон номер уже есть на базе данных',
            },
          },
        },
      ],
    },
  })
  @ApiCreatedResponse({description:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNjY3MDg2MjUyLCJleHAiOjE2NjcwOTcwNTJ9.UGTO6OglEXQM0s5EdiS00bb4ZBmjlqcVYVbHFGR4gb8"})
  @ApiOperation({summary: 'registration пользователя'})
  @ApiResponse({status: 201})
  @Post('registration')
  async registration(@Body()data: UserLoginDto, @Res({passthrough: true})res) {
    const response = await this.authService.registration(data);
    res.cookie('refreshToken', response.refresh_token, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
    return response.access_token;
  }
  @ApiOkResponse({description:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNjY3MDg2MjUyLCJleHAiOjE2NjcwOTcwNTJ9.UGTO6OglEXQM0s5EdiS00bb4ZBmjlqcVYVbHFGR4gb8"})
  @ApiOperation({summary: 'refresh пользователя'})
  @ApiResponse({status: 201})
  @Get('refresh')
  async refresh(@Req()request, @Res({passthrough: true})response) {
    const {refreshToken} = request.cookies;
    if(refreshToken == undefined || !refreshToken || refreshToken == 'undefined'){
      throw new UnauthorizedException("Вы не зарегестрированы")
    }
    const res = await this.authService.refresh(refreshToken);
    response.cookie('refreshToken', response.refresh_token, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
    return res.access_token;
  }

  @ApiOperation({summary: 'logout пользователя'})
  @ApiResponse({status: 201})
  @Get('logout')
  async logout(@Req()request, @Res({passthrough: true})response) {
    const {refreshToken} = request.cookies;
    response.clearCookie('refresh_token');
    await this.authService.logout(refreshToken);
  }
}
