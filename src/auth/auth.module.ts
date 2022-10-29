import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './auth.entity';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports:[TypeOrmModule.forFeature([Auth]),UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'key2',
      signOptions: { expiresIn: '180m' },
    }),]
  ,exports:[JwtModule]
})
export class AuthModule {}
