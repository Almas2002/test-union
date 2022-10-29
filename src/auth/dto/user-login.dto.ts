import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserLoginDto{
  @IsNotEmpty()
  @ApiProperty({example:"12345",description:"пороль"})
  password:string;

  @IsNotEmpty()
  @ApiProperty({example:"87478015284",description:"номер телефона"})
  phone:string;
}