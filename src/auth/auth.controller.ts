import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  RequestMapping,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRespooneDto } from './dto/user-respone.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { TokenBaseRest } from './dto/token-base-rest.dto';
import { LoginDto } from './dto/login-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthGuard } from '@nestjs/passport';
import { RefreshTokenGuard } from 'src/common/guard/refresh.guard';
import { GetUser } from 'src/common/decorator/get-user.decorators';
import { User } from '../user/user.entity';
import RequestWithUser from 'src/common/interface/request-with-user.interface';
import { BaseRespone } from 'src/common/base/base-rest';
import { ApiTags } from '@nestjs/swagger';

/**
 * this
 *
 */

@Controller('api/v1/auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  public register(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<TokenBaseRest> {
    return this.authService.signup(registerUserDto);
  }

  @Post('/login')
  public login(@Body() loginDto: LoginDto): Promise<TokenBaseRest> {
    return this.authService.login(loginDto);
  }

  @Post('/refresh')
  @UseGuards(AuthGuard())
  public refresh(
    @Req() request: RequestWithUser,
    @Body() refreshTokendto: RefreshTokenDto,
  ): Promise<TokenBaseRest> {
    return this.authService.refreshToken(request, refreshTokendto);
  }

  @Get('/logout')
  @UseGuards(AuthGuard())
  public logout(@Req() request: RequestWithUser): Promise<boolean> {
    return this.authService.logout(request);
  }

  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  public async getProfile(@Req() req: RequestWithUser): Promise<User> {
    return req.user;
  }
}
