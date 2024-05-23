import { CommonEntity } from 'src/common/entity/common.entity';
import { Role } from '../role/role.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Action } from 'src/common/enum/action.enum';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  action: Action;

  @Column()
  subject: string;

  @Column({ default: false })
  inverted: boolean;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @Column({ type: 'json', nullable: true })
  conditions: string;

  @ManyToOne(() => Role, (role) => role.permissions)
  role: Role;
}
