import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Currency {
  @ApiProperty({description:"идентификатор",example:1})
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty({description:"название валюты",example:"EUR"})
  @Column({ unique: true })
  name: string;
  @ApiProperty({description:"цена в тенге",example:475.60})
  @Column({ type: 'float' })
  rate: number;
}