import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { User } from 'src/user/user.entity';

export const GetUser = createParamDecorator((req): User => {
  return req.user;
});
