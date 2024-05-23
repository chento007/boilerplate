import { Repository } from 'typeorm';
import { Permission } from './permission.entity';

export interface PermissionRepository extends Repository<Permission> {}
