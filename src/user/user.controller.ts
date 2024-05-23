import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserRespooneDto } from '../auth/dto/user-respone.dto';
import { UsersService } from './user.service';
import { User } from './user.entity';
import { TokenBaseRest } from '../auth/dto/token-base-rest.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from 'src/common/decorator/roles.decorator';
import { AppRoles } from 'src/common/enum/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { checkAbilites } from 'src/common/decorator/abilities.decorator';
import { Paginate, PaginateQuery, Paginated } from 'nestjs-paginate';
import { AbilitiesGuard } from 'src/common/guard/ability.guard';
import { Action } from 'src/common/enum/action.enum';
import { Subject } from 'src/common/enum/subject.enum';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @Roles([AppRoles.ADMINS])
  @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
  @checkAbilites({ action: Action.Manage, subject: Subject.all })
  public getAll(@Paginate() query: PaginateQuery): Promise<Paginated<User>> {
    return this.userService.findAll(query);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), AbilitiesGuard)
  @Roles([AppRoles.ADMINS])
  @checkAbilites({ action: Action.Manage, subject: Subject.all })
  public create(@Body() createUserDto: CreateUserDto): Promise<TokenBaseRest> {
    return this.userService.create(createUserDto);
  }
}
