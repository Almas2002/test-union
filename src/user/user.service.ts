
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

import { UserLoginDto } from '../auth/dto/user-login.dto';


export class UserService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>,
  ) {
  }

  async create(dto: UserLoginDto, rol: string = 'ADMIN') {
    const user = await this.userRepository.save(dto);
    await this.userRepository.save(user);
    delete user.password;
    return user;
  }

  async findUserById(id: number) {
    return await this.userRepository.findOne({ where: { id }});
  }

  async getUserByPhoneNumber(phone: string) {
    return this.userRepository.findOne({where:{phone},select: ['password', 'id', 'phone']});
  }
}