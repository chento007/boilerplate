import {
  Column,
  Entity
} from 'typeorm';
import { TaskStatus } from './tasks-status.enum';
import { CommonEntity } from 'src/common/entity/common.entity';

@Entity()
export class Task extends CommonEntity {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;
}
