import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from './auth.entity';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserLoginDto } from './dto/user-login.dto';
import * as bcrypt from 'bcrypt'
@Injectable()
export class AuthService {
  constructor(@InjectRepository(Auth) private authRepository: Repository<Auth>, private jwtService: JwtService, private userService: UserService) {
  }

  private generationToken(user: User) {
    const payload = { id: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, { secret: process.env.JWT_REFRESH_SECRET || 'key', expiresIn: '30d' }),
    };
  }

  async login(data: UserLoginDto) {
    const user = await this.validation(data);
    const tokens = await this.generationToken(user);
    await this.saveToken(user, tokens.refresh_token);
    return { ...tokens };
  }

  async registration(data: UserLoginDto, admin: boolean = false) {
    const hashPassword = await bcrypt.hash(data.password, 5);
    const candidate = await this.userService.getUserByPhoneNumber(data.phone);
    if (candidate) {
      throw new HttpException('такой пользователь уже существует', 400);
    }
    const user = await this.userService.create({ ...data, password: hashPassword });

    const tokens = await this.generationToken(user);
    await this.authRepository.save({ user, refresh_token: tokens.refresh_token });
    return { ...tokens };

  }

  private async saveToken(user: User, refresh_token: string) {
    const candidate = await this.authRepository.findOne({ where: { user:{id:user.id} } });
    if (candidate) {

      return await this.authRepository.update({ id: candidate.id }, { refresh_token });
    }
    return await this.authRepository.save({ refresh_token, user });
  }

  private async validation(dto: UserLoginDto): Promise<User> {
    const user = await this.userService.getUserByPhoneNumber(dto.phone);
    const errors = {};
    if (!user) {
      errors['phone'] = ['Некорректный телефон номер'];
      throw new HttpException({ errors }, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const campfirePassword = await bcrypt.compare(dto.password, user.password);
    if (!campfirePassword) {
      errors['password'] = ['Некорректный пороль'];
      throw new HttpException({ errors }, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    return user;
  }

  private async findRefreshToken(refresh_token: string) {
    return await this.authRepository.findOne({ where: { refresh_token } });
  }

  private verifyRefreshToken(refresh_token: string): { id: number } {
    return this.jwtService.verify(refresh_token, { secret: 'key' });
  }

  async refresh(refresh_token) {
    if (!refresh_token) {
      throw new UnauthorizedException({ message: 'вы не загерестрированы' });
    }
    const verifyToken = this.verifyRefreshToken(refresh_token);
    const refreshTokenFromDB = await this.findRefreshToken(refresh_token);
    if (!verifyToken || !refreshTokenFromDB) {
      throw new UnauthorizedException({ message: 'вы не загерестрированы' });
    }
    const user = await this.userService.findUserById(verifyToken.id);

    const tokens = this.generationToken(user);
    await this.saveToken(user, tokens.refresh_token);
    //res.cookie('refreshToken', tokens.refresh_token, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
    return { ...tokens };
  }

  async logout(refresh_token: string) {
    return await this.authRepository.delete({ refresh_token });
  }

}