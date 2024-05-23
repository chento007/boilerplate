import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  ForcedSubject,
  InferSubjects,
  MongoAbility,
  RawRuleOf,
  createMongoAbility,
} from '@casl/ability';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import {
  CHECK_ABILITY,
  RequiredRule,
} from 'src/common/decorator/abilities.decorator';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Action } from 'src/common/enum/action.enum';

import { AppRoles } from '../enum/roles.enum';
import { LessThan } from 'typeorm';
import { User } from 'src/user/user.entity';

export const actions = [
  'read',
  'manage',
  'create',
  'update',
  'delete',
] as const;

export const subjects = ['Story', 'User', 'all'] as const;

export type Abilities = [
  (typeof actions)[number],
  (
    | (typeof subjects)[number]
    | ForcedSubject<Exclude<(typeof subjects)[number], 'all'>>
  ),
];

export type AppAbility = MongoAbility<Abilities>;

@Injectable()
export class AbilitiesGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  createAbility = (rules: RawRuleOf<AppAbility>[]) =>
    createMongoAbility<AppAbility>(rules);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get(Roles, context.getHandler()) || null;
    const rules: any =
      this.reflector.get<RequiredRule[]>(CHECK_ABILITY, context.getHandler()) ||
      [];
    const { user } = context.switchToHttp().getRequest();

    if (!user || !roles.length || !rules.length) {
      return true;
    }

    return this.checkPermission(user, roles, rules);
  }

  private checkPermission(
    user: User,
    roles: string[],
    rules: RequiredRule[],
  ): boolean {
    // Check if the user has any of the required roles
    const hasMatchingRole = user.roles.some((userRole) =>
      roles.includes(userRole.name),
    );
    if (!hasMatchingRole) {
      return false;
    }

    // Check user's permissions against the required rules
    return user.roles.some((userRole) =>
      userRole.permissions.some((permission) =>
        rules.some(
          (rule) =>
            permission.action === rule.action &&
            permission.subject === rule.subject,
        ),
      ),
    );
  }
}
