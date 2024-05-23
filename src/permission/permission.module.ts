import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './permission.entity';
import { UsersService } from '../user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Permission])],
})
export class PermissionModule {}
