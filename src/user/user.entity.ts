import { IsDate, IsEmail } from 'class-validator';
import { CommonEntity } from 'src/common/entity/common.entity';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinTable,
  ManyToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../role/role.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User extends CommonEntity {
  @Column({
    type: 'text',
    nullable: true,
    unique: true,
  })
  username: string;

  @IsEmail()
  @Column({
    type: 'text',
    unique: true,
  })
  email: string;

  @Column({
    type: 'text',
  })
  @Exclude()
  password: string;

  @Column({ nullable: true })
  @Exclude()
  refreshToken?: string;

  @Column({ nullable: true })
  thumbnail?: string;

  @ManyToMany(() => Role, (role) => role.user, { eager: true })
  @JoinTable()
  roles: Role[];
}
