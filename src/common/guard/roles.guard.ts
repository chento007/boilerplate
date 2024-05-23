import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, Roles } from '../decorator/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/role/role.entity';

@Injectable()
export class RolesGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // call AuthGuard in order to ensure user is injected in request
    const roles = this.reflector.get(Roles, context.getHandler()) || null;
    if (!roles) {
      return true;
    }

    // successfull authentication, user is injected
    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      return true;
    }

    if (user.roles.length > 0) {
      const hasMatchingRole: boolean = user.roles.some((userRole: Role) => {
        return roles.some((item: string) => userRole.name === item);
      });

      if (hasMatchingRole) {
        return true;
      }
    }
    return false;
  }
}
