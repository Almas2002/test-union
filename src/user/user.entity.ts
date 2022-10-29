
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';


@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  phone: string;
  @Column({ select: false })
  password: string;
}