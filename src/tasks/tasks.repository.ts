import type { Repository } from 'typeorm';
import { Task } from './tasks.entity';

export interface TaskRepository extends Repository<Task> {}
