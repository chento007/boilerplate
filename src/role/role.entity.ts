import { AppRoles } from 'src/common/enum/roles.enum';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Permission } from '../permission/permission.entity';

@Entity()
export class Role {
  constructor() {
    this.id = 1;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    nullable: false,
  })
  name: AppRoles;

  @ManyToMany(() => User, (user) => user.roles)
  user: User[];

  @OneToMany(() => Permission, (permission) => permission.role, { eager: true })
  permissions: Permission[];
}
